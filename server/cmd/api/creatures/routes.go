package creatures

import (
	"database/sql"
	"github.com/go-chi/chi/v5"
	"github.com/legend-of-tony/Habitmon/cmd/api/middleware"
	"github.com/legend-of-tony/Habitmon/internal/creatures"
	"github.com/legend-of-tony/Habitmon/internal/helpers"
	"log"
	"net/http"
)

const BasePath = "/creatures"

func Routes(db *sql.DB) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.AuthMiddleware)
	r.Post("/starter", func(w http.ResponseWriter, r *http.Request) {
		userID, ok := middleware.GetUserID(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		c, err := creatures.Ensure(r.Context(), db, userID)
		if err != nil {
			log.Printf("ensure starter creature for user %d: %v", userID, err)
			http.Error(w, "Could not load your Habitmon. Please retry.", http.StatusInternalServerError)
			return
		}
		helpers.WriteJson(w, http.StatusOK, struct {
			Status string             `json:"status"`
			Data   creatures.Creature `json:"data"`
		}{"Success", c})
	})
	return r
}
