package users

import (
	"encoding/json"
	"net/http"

	"github.com/legend-of-tony/Habitmon/internal/hash"
)

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	passwordHash, err := hash.Hash(req.Password)
	if err != nil {
		http.Error(w, "failed to process request", http.StatusInternalServerError)
		return
	}

	_, err = h.db.ExecContext(r.Context(), "INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5)", req.FirstName, req.LastName, req.Email, req.Username, passwordHash)
	if err != nil {
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ResponseStatus{
		Status:  "Success",
		Message: "User created succesfully",
		Data:    CreateUserResponse{FirstName: req.FirstName, LastName: req.LastName, Email: req.Email, Username: req.Username},
	})
}
