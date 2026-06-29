package db

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/legend-of-tony/Habitmon/internal/env"
	_ "github.com/lib/pq"
)

type dbConfig struct {
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
	ConnMaxIdleTime time.Duration
}

func OpenDB() (*sql.DB, error) {
	cfg := dbConfig{
		MaxOpenConns:    env.GetEnvInt("DB_MAX_OPEN_CONNS", 30),
		MaxIdleConns:    env.GetEnvInt("DB_MAX_IDLE_CONNS", 30),
		ConnMaxLifetime: env.GetEnvDuration("DB_MAX_LIFETIME", 5*time.Minute),
		ConnMaxIdleTime: env.GetEnvDuration("DB_MAX_IDLE_TIME", 5*time.Minute),
	}

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, fmt.Errorf("failed to open to db: %w", err)
	}

	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.ConnMaxLifetime)
	db.SetConnMaxIdleTime(cfg.ConnMaxIdleTime)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("Failed to connect to db: %w", err)
	}

	return db, nil

}
