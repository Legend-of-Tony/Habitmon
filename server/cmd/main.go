package main

import (
	"log"
	"os"

	"github.com/legend-of-tony/Habitmon/cmd/api"
	"github.com/legend-of-tony/Habitmon/internal/auth"
	"github.com/legend-of-tony/Habitmon/internal/db"
)

func main() {

	if err := auth.ValidateConfig(); err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = ":8080"
	}

	db, err := db.OpenDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	server := api.NewServer(port, db)
	log.Fatal(server.Start())
}
