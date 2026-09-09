package creatures

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"os"
	"reflect"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"
)

func TestGenerate(t *testing.T) {
	for range 256 {
		c, err := generate()
		if err != nil {
			t.Fatal(err)
		}
		validTail := c.TailVariant == nil || slices.Contains(tailVariants[:], *c.TailVariant)
		validHorn := c.HornVariant == nil || slices.Contains(hornVariants[:], *c.HornVariant)
		if !slices.Contains(earVariants[:], c.EarVariant) || !validTail || !validHorn || !slices.Contains(paletteVariants[:], c.PaletteVariant) || c.EyeIndex < 0 || c.EyeIndex >= AtlasColumns*AtlasRows || c.MouthIndex < 0 || c.MouthIndex >= AtlasColumns*AtlasRows || c.XP != 0 {
			t.Fatalf("invalid appearance: %+v", c)
		}
	}
}

// Explicit opt-in only. All objects live in an isolated schema that is cleaned up.
func TestPostgresStarter(t *testing.T) {
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("set TEST_DATABASE_URL to a disposable Postgres database")
	}
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	ctx := context.Background()
	schema := fmt.Sprintf("habitmon_test_%d", time.Now().UnixNano())
	if _, err = db.ExecContext(ctx, "CREATE SCHEMA "+schema); err != nil {
		t.Fatal(err)
	}
	defer db.ExecContext(ctx, "DROP SCHEMA "+schema+" CASCADE")
	inSchema := func() *sql.Tx {
		t.Helper()
		tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
		if err != nil {
			t.Fatal(err)
		}
		if _, err := tx.ExecContext(ctx, "SET LOCAL search_path TO "+schema); err != nil {
			tx.Rollback()
			t.Fatal(err)
		}
		return tx
	}
	tx := inSchema()
	for _, path := range []string{"../migrations/20260627225652_add_user_table.sql", "../migrations/20260909000000_add_creatures_table.sql", "../migrations/20260909000100_make_horn_and_tail_optional.sql", "../migrations/20260909000200_add_creature_palette.sql"} {
		migration, err := os.ReadFile(path)
		if err != nil {
			t.Fatal(err)
		}
		if _, err = tx.ExecContext(ctx, strings.Split(string(migration), "-- +goose Down")[0]); err != nil {
			t.Fatal(err)
		}
	}
	var userID int
	if err = tx.QueryRowContext(ctx, "INSERT INTO users(first_name,last_name,email,username,password_hash) VALUES ('a','b','a@b','ab','hash') RETURNING id").Scan(&userID); err != nil {
		t.Fatal(err)
	}
	if err = tx.Commit(); err != nil {
		t.Fatal(err)
	}
	results := make(chan Creature, 12)
	errs := make(chan error, 12)
	var wg sync.WaitGroup
	for range 12 {
		wg.Go(func() {
			tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
			if err != nil {
				errs <- err
				return
			}
			defer tx.Rollback()
			if _, err = tx.ExecContext(ctx, "SET LOCAL search_path TO "+schema); err != nil {
				errs <- err
				return
			}
			c, err := EnsureTx(ctx, tx, userID)
			if err != nil {
				errs <- err
				return
			}
			if err = tx.Commit(); err != nil {
				errs <- err
				return
			}
			results <- c
		})
	}
	wg.Wait()
	close(results)
	close(errs)
	for err := range errs {
		t.Fatal(err)
	}
	var first Creature
	for c := range results {
		if first.ID == 0 {
			first = c
		}
		if !reflect.DeepEqual(c, first) {
			t.Fatalf("duplicate calls returned different records: %+v, %+v", first, c)
		}
	}
	tx = inSchema()
	defer tx.Rollback()
	if _, err = tx.ExecContext(ctx, "UPDATE creatures SET xp=42 WHERE user_id=$1", userID); err != nil {
		t.Fatal(err)
	}
	c, err := EnsureTx(ctx, tx, userID)
	if err != nil || c.XP != 42 || c.EarVariant != first.EarVariant || c.UpdatedAt != first.UpdatedAt {
		t.Fatalf("retry changed state: %+v %v", c, err)
	}
	tx.Rollback()
	tx = inSchema()
	var rolledBackID int
	if err = tx.QueryRowContext(ctx, "INSERT INTO users(first_name,last_name,email,username,password_hash) VALUES ('c','d','c@d','cd','hash') RETURNING id").Scan(&rolledBackID); err != nil {
		t.Fatal(err)
	}
	if _, err = EnsureTx(ctx, tx, rolledBackID); err != nil {
		t.Fatal(err)
	}
	tx.Rollback()
	tx = inSchema()
	defer tx.Rollback()
	var count int
	if err = tx.QueryRowContext(ctx, "SELECT count(*) FROM creatures WHERE user_id=$1", rolledBackID).Scan(&count); err != nil || count != 0 {
		t.Fatalf("rollback failed: %d %v", count, err)
	}
	if _, err = tx.ExecContext(ctx, "DELETE FROM users WHERE id=$1", userID); err != nil {
		t.Fatal(err)
	}
	if err = tx.QueryRowContext(ctx, "SELECT count(*) FROM creatures WHERE user_id=$1", userID).Scan(&count); err != nil || count != 0 {
		t.Fatalf("cascade failed: %d %v", count, err)
	}
}
