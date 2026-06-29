package users

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/legend-of-tony/Habitmon/internal/hash"
	"github.com/lib/pq"
)

func validateCreateUserRequest(req CreateUserRequest) string {
	switch {
	case req.Email == "":
		return "email field is blank"
	case !strings.Contains(req.Email, "@"):
		return "not valid email"
	case req.FirstName == "":
		return "first name field is blank"
	case req.LastName == "":
		return "last name field is blank"
	case req.Username == "":
		return "username field is blank"
	case req.Password == "":
		return "password field is blank"
	case len(req.Password) < 8:
		return "password is too short"
	}
	return ""
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req CreateUserRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if msg := validateCreateUserRequest(req); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}

	passwordHash, err := hash.Hash(req.Password)
	if err != nil {
		http.Error(w, "failed to process request", http.StatusInternalServerError)
		return
	}

	_, err = h.db.ExecContext(r.Context(), "INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5)", req.FirstName, req.LastName, req.Email, req.Username, passwordHash)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			http.Error(w, "email or username already exists", http.StatusConflict)
			return
		}
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ResponseStatus{
		Status:  "Success",
		Message: "User created successfully",
		Data:    CreateUserResponse{FirstName: req.FirstName, LastName: req.LastName, Email: req.Email, Username: req.Username},
	})
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req LoginUserRequest
	err := json.NewDecoder(r.Body).Decode(req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
}
