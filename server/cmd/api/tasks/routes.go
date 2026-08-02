package tasks

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/legend-of-tony/Habitmon/cmd/api/middleware"
)

func Routes(db *sql.DB) http.Handler {
	h := &TaskHandler{db: db}
	r := chi.NewRouter()
	//r.With(middleware.AuthMiddleware).Get("/", h.GetTasks)
	//r.With(middleware.AuthMiddleware).Get(ByID, h.GetTaskByID)
	r.With(middleware.AuthMiddleware).Post("/", h.CreateTask)
	//r.With(middleware.AuthMiddleware).Delete(ByID, h.DeleteTask)
	//r.With(middleware.AuthMiddleware).Patch(ByID, h.UpdateTask)
	return r
}
