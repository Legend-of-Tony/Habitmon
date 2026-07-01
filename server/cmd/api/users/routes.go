package users

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/legend-of-tony/Habitmon/cmd/api/middleware"
)

func Routes(db *sql.DB) http.Handler {
	h := &UserHandler{db: db}
	r := chi.NewRouter()
	r.Post(Register, h.CreateUser)
	r.Post(Login, h.LoginUser)
	r.With(middleware.AuthMiddleware).Patch("/", h.UpdateUser)
	r.With(middleware.AuthMiddleware).Get("/", h.GetUser)
	r.With(middleware.AuthMiddleware).Delete("/", h.DeleteUser)
	return r
}
