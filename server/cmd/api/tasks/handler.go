package tasks

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
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
		`INSERT INTO tasks (user_id, title, sessions)
		VALUES ($1,$2,$3)
		RETURNING title, sessions`,
		userID,
		req.Title,
		req.Sessions).Scan(
		&res.Title,
		&res.Sessions)
	if err != nil {
		http.Error(w, "failed to create task", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusCreated, ResponseStatus{
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

	taskID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil || taskID <= 0 {
		http.Error(w, "invalid task ID", http.StatusBadRequest)
		return
	}

	result, err := h.db.ExecContext(r.Context(), `DELETE FROM tasks WHERE user_id=$1 and id = $2`, userID, taskID)
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

func (h *TaskHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	defer helpers.BodyClose(r)

	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	taskID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil || taskID <= 0 {
		http.Error(w, "invalid task ID", http.StatusBadRequest)
		return
	}

	var req UpdateTaskRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if req.Title == nil &&
		req.Completed == nil &&
		req.Sessions == nil &&
		req.Progress == nil {
		http.Error(w, "no fields provided", http.StatusBadRequest)
		return
	}

	if req.Title != nil && strings.TrimSpace(*req.Title) == "" {
		http.Error(w, "title cannot be blank", http.StatusBadRequest)
		return
	}

	if req.Sessions != nil && *req.Sessions < 0 {
		http.Error(w, "sessions cannot be less than zero", http.StatusBadRequest)
		return
	}

	if req.Progress != nil && *req.Progress < 0 {
		http.Error(w, "progress cannot be less than zero", http.StatusBadRequest)
		return
	}

	var res UpdateTaskResponse
	err = h.db.QueryRowContext(r.Context(),
		`UPDATE tasks SET
	title = COALESCE($1, title),
	completed = COALESCE($2, completed),
	sessions = COALESCE($3, sessions),
	progress = COALESCE($4, progress),
	updated_at = NOW()
	WHERE id = $5
	AND user_id = $6
	RETURNING title, completed, sessions, progress, updated_at`,
		req.Title,
		req.Completed,
		req.Sessions,
		req.Progress,
		taskID,
		userID).Scan(
		&res.Title,
		&res.Completed,
		&res.Sessions,
		&res.Progress,
		&res.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "failed to update task", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "Task updated successfully",
		Data:    res,
	})
}

func (h *TaskHandler) GetTasks(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := h.db.QueryContext(r.Context(),
		`SELECT 
		id,
		title,
		completed,
		progress,
		sessions,
		updated_at,
		created_at
		FROM tasks WHERE user_id = $1`,
		userID)

	if err != nil {
		http.Error(w, "failed to get tasks", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tasks := make([]GetTasks, 0)

	for rows.Next() {
		var task GetTasks

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Completed,
			&task.Progress,
			&task.Sessions,
			&task.UpdatedAt,
			&task.CreatedAt,
		)
		if err != nil {
			http.Error(w, "failed to read task", http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "failed while reading tasks", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "Tasks retrieved successfully",
		Data:    tasks,
	})
}

func (h *TaskHandler) GetTaskByID(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	taskID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil || taskID <= 0 {
		http.Error(w, "invalid task ID", http.StatusBadRequest)
		return
	}

	var res GetTasks
	err = h.db.QueryRowContext(r.Context(),
		`SELECT id,
		title,
		completed,
		sessions,
		progress,
		created_at,
		updated_at
		FROM tasks WHERE id = $1 AND user_id = $2`, taskID, userID).Scan(
		&res.ID,
		&res.Title,
		&res.Completed,
		&res.Sessions,
		&res.Progress,
		&res.CreatedAt,
		&res.UpdatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "task not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "failed to get task", http.StatusInternalServerError)
		return
	}

	helpers.WriteJson(w, http.StatusOK, ResponseStatus{
		Status:  "Success",
		Message: "Retrieved task successfully",
		Data:    res,
	})

}
