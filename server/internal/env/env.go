package env

import (
	"os"
	"strconv"
	"time"
)

func GetEnvInt(key string, fallback int) int {
	val, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		return fallback
	}
	return val
}

func GetEnvDuration(key string, fallback time.Duration) time.Duration {
	val, err := time.ParseDuration(os.Getenv(key))
	if err != nil {
		return fallback
	}
	return val
}

func GetString(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}
