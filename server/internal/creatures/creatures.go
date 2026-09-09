package creatures

import (
	"context"
	"crypto/rand"
	"database/sql"
	"math/big"
	"time"
)

// These approved identifiers match the meshes in baby-habitmon.glb.
var earVariants = [...]string{"ear_1", "ear_2", "ear_3"}
var tailVariants = [...]string{"tail_1", "tail_2"}
var hornVariants = [...]string{"horn_1"}
var paletteVariants = [...]string{"ocean", "berry", "moss", "sunset", "lavender"}

const AtlasColumns = 4
const AtlasRows = 4

type Creature struct {
	ID             int64     `json:"id"`
	UserID         int64     `json:"user_id"`
	XP             int64     `json:"xp"`
	EarVariant     string    `json:"ear_variant"`
	TailVariant    *string   `json:"tail_variant"`
	HornVariant    *string   `json:"horn_variant"`
	PaletteVariant string    `json:"palette_variant"`
	EyeIndex       int       `json:"eye_index"`
	MouthIndex     int       `json:"mouth_index"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func generate() (Creature, error) {
	var c Creature
	choices := make([]int, 6)
	for i, count := range []int{len(earVariants), len(tailVariants) + 1, len(hornVariants) + 1, len(paletteVariants), AtlasColumns * AtlasRows, AtlasColumns * AtlasRows} {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(count)))
		if err != nil {
			return c, err
		}
		choices[i] = int(n.Int64())
	}
	c.EarVariant = earVariants[choices[0]]
	if choices[1] > 0 {
		value := tailVariants[choices[1]-1]
		c.TailVariant = &value
	}
	if choices[2] > 0 {
		value := hornVariants[choices[2]-1]
		c.HornVariant = &value
	}
	c.PaletteVariant = paletteVariants[choices[3]]
	c.EyeIndex, c.MouthIndex = choices[4], choices[5]
	return c, nil
}

// EnsureTx is shared by signup and first-login onboarding. At READ COMMITTED,
// the SELECT gets a fresh snapshot after any concurrent conflicting insert.
// DO NOTHING preserves XP, appearance and timestamps on every retry.
func EnsureTx(ctx context.Context, tx *sql.Tx, userID int) (Creature, error) {
	c, err := generate()
	if err != nil {
		return c, err
	}
	_, err = tx.ExecContext(ctx, `INSERT INTO creatures (user_id, ear_variant, tail_variant, horn_variant, palette_variant, eye_index, mouth_index)
 VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (user_id) DO NOTHING`, userID, c.EarVariant, c.TailVariant, c.HornVariant, c.PaletteVariant, c.EyeIndex, c.MouthIndex)
	if err != nil {
		return Creature{}, err
	}
	err = tx.QueryRowContext(ctx, `SELECT id,user_id,xp,ear_variant,tail_variant,horn_variant,palette_variant,eye_index,mouth_index,created_at,updated_at
 FROM creatures WHERE user_id=$1`, userID).Scan(&c.ID, &c.UserID, &c.XP, &c.EarVariant, &c.TailVariant, &c.HornVariant, &c.PaletteVariant, &c.EyeIndex, &c.MouthIndex, &c.CreatedAt, &c.UpdatedAt)
	return c, err
}

func Ensure(ctx context.Context, db *sql.DB, userID int) (Creature, error) {
	tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
	if err != nil {
		return Creature{}, err
	}
	defer tx.Rollback()
	c, err := EnsureTx(ctx, tx, userID)
	if err != nil {
		return Creature{}, err
	}
	return c, tx.Commit()
}
