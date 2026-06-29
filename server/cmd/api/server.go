package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/legend-of-tony/Habitmon/cmd/api/users"
)

type Server struct {
	router *chi.Mux
	addr   string
	db     *sql.DB
}

func NewServer(addr string, db *sql.DB) *Server {
	s := &Server{
		router: chi.NewRouter(),
		addr:   addr,
		db:     db,
	}
	s.setupMiddleware()
	s.setupRoutes()
	return s
}

func (s *Server) setupMiddleware() {
	s.router.Use(middleware.Logger)
	s.router.Use(middleware.Recoverer)
}

func (s *Server) setupRoutes() {
	s.router.Mount(users.BasePath, users.Routes(s.db))
}

func (s *Server) Start() error {
	log.Printf("Server starting on %s", s.addr)
	return http.ListenAndServe(s.addr, s.router)
}
