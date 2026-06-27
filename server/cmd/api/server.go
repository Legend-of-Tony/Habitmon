package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Server struct {
	router *chi.Mux
}

func NewServer() *Server {
	s := &Server{router: chi.NewRouter()}
	s.setupMiddleware()
	return s
}

func (s *Server) setupMiddleware() {
	s.router.Use(middleware.Logger)
	s.router.Use(middleware.Recoverer)
}

func (s *Server) Start(addr string) error {
	return http.ListenAndServe(addr, s.router)
}
