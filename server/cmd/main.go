package main

import (
	"fmt"
	"log"

	"github.com/legend-of-tony/Habitmon/cmd/api"
)

func main() {
	server := api.NewServer()
	log.Fatal(server.Start(":8080"))
	fmt.Printf("Server started on: %s/n", server.addr)
}
