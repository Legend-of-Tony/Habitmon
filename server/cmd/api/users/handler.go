package users

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/legend-of-tony/Habitmon/cmd/api/middleware"
	"github.com/legend-of-tony/Habitmon/internal/auth"
	"github.com/legend-of-tony/Habitmon/internal/hash"
	"github.com/legend-of-tony/Habitmon/internal/helpers"
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
	defer helpers.BodyClose(r)

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

	var res CreateUserResponse
	err = h.db.QueryRowContext(r.Context(),
		`INSERT INTO users (first_name, last_name, email, username, password_hash) 
				VALUES ($1, $2, $3, $4, $5)
				RETURNING first_name, last_name, email, username`,
		req.FirstName,
		req.LastName,
		req.Email,
		req.Username,
		passwordHash).Scan(
		&res.FirstName,
		&res.LastName,
		&res.Email,
		&res.Username)
	if err != nil {
		pqErr, ok := errors.AsType[*pq.Error](err)
		if ok && pqErr.Code == "23505" {
			http.Error(w, "email or username already exists", http.StatusConflict)
			return
		}
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "User created successfully",
		Data:    res,
	})
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	defer helpers.BodyClose(r)

	var req LoginUserRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		http.Error(w, "one or more fields is empty", http.StatusBadRequest)
		return
	}
	var userID int
	var hashedPassword string

	err = h.db.QueryRowContext(r.Context(), "SELECT id, password_hash FROM users WHERE email=$1", req.Email).Scan(&userID, &hashedPassword)
	if err != nil {
		http.Error(w, "user not found", http.StatusBadRequest)
		return
	}

	validated := hash.Check(req.Password, hashedPassword)
	if !validated {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token, err := auth.CreateToken(userID)
	if err != nil {
		http.Error(w, "failed to create session token", http.StatusBadRequest)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   int((24 * time.Hour).Seconds()),
	})

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "Login successful",
	})

}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	defer helpers.BodyClose(r)

	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req UpdateUserRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if req.FirstName == nil &&
		req.LastName == nil &&
		req.Email == nil &&
		req.Username == nil &&
		req.Password == nil {
		http.Error(w, "no fields provided", http.StatusBadRequest)
		return
	}

	if req.Email != nil && !strings.Contains(*req.Email, "@") {
		http.Error(w, "not valid email", http.StatusBadRequest)
		return
	}
	if req.Password != nil && len(*req.Password) < 8 {
		http.Error(w, "password is too short", http.StatusBadRequest)
		return
	}

	var passwordHash *string
	if req.Password != nil {
		hashed, err := hash.Hash(*req.Password)
		if err != nil {
			http.Error(w, "failed to process request", http.StatusInternalServerError)
			return
		}
		passwordHash = &hashed
	}

	var res UpdateUserResponse
	err = h.db.QueryRowContext(r.Context(),
		`UPDATE users SET first_name = COALESCE($1, first_name),
		last_name = COALESCE($2, last_name),
		email = COALESCE($3, email),
		username = COALESCE($4, username),
		password_hash = COALESCE($5 , password_hash),
		updated_at = NOW()
		WHERE id = $6
		RETURNING id, first_name, last_name, email, username, updated_at`,
		req.FirstName,
		req.LastName,
		req.Email,
		req.Username,
		passwordHash,
		userID).Scan(
		&res.ID,
		&res.FirstName,
		&res.LastName,
		&res.Email,
		&res.Username,
		&res.UpdatedAt)
	if err != nil {
		pqErr, ok := errors.AsType[*pq.Error](err)
		if ok && pqErr.Code == "23505" {
			http.Error(w, "username or email already exists", http.StatusBadRequest)
			return
		}
		http.Error(w, "failed to update user", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "User Updated Successfully",
		Data:    res,
	})

}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {

	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var res GetUserResponse
	err := h.db.QueryRowContext(r.Context(),
		`SELECT id ,first_name, 
       last_name, 
       email, 
       username, 
       created_at FROM users WHERE id=$1`,
		userID).Scan(
		&res.ID,
		&res.FirstName,
		&res.LastName,
		&res.Email,
		&res.Username,
		&res.CreatedAt)
	if err != nil {
		http.Error(w, "failed to get user", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "User Retrieved Successfully",
		Data:    res,
	})

}
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	result, err := h.db.ExecContext(r.Context(), `DELETE FROM users WHERE id=$1`, userID)
	if err != nil {
		http.Error(w, "failed to delete user", http.StatusInternalServerError)
		return
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "failed to delete user", http.StatusInternalServerError)
		return
	}
	if rowsAffected == 0 {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "User deleted successfully",
	})
}
