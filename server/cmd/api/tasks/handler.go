package tasks

import (
	"encoding/json"
	"net/http"

	"github.com/legend-of-tony/Habitmon/cmd/api/middleware"
	"github.com/legend-of-tony/Habitmon/internal/helpers"
)

func validateCreateTask(req CreateTaskRequest) string {
	switch {
	case req.Title == "":
		return "Title cannot be blank"
	case req.Sessions < 0:
		return "Sessions cannot be less than zero"
	}
	return ""
}

func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	defer helpers.BodyClose(r)

	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateTaskRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if msg := validateCreateTask(req); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}

	var res CreateTaskRequest
	err = h.db.QueryRowContext(r.Context(),
		`INSERT INTO tasks (user_id, title, sessions, due_date)
		VALUES ($1,$2,$3,$4)
		RETURNING title, sessions, due_date`,
		userID,
		req.Title,
		req.Sessions,
		req.DueDate).Scan(
		&res.Title,
		&res.Sessions,
		&res.DueDate)
	if err != nil {
		http.Error(w, "failed to create task", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "Task created successfully",
		Data:    res,
	})

}

func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {

	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	result, err := h.db.ExecContext(r.Context(), `DELETE FROM tasks WHERE user_id=$1`, userID)
	if err != nil {
		http.Error(w, "failed to delete task", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "failed to delete task", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "Task deleted successfully",
	})

}
