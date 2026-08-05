package tasks

import (
	"database/sql"
	"time"
)

type ResponseStatus struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
}

type TaskHandler struct {
	db *sql.DB
}

type CreateTaskRequest struct {
	Title    string `json:"title"`
	Sessions int    `json:"sessions"`
}

type UpdateTaskRequest struct {
	Title     *string `json:"title"`
	Completed *bool   `json:"completed"`
	Sessions  *int    `json:"sessions"`
	Progress  *int    `json:"progress"`
}

type UpdateTaskResponse struct {
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	Sessions  int       `json:"sessions"`
	Progress  int       `json:"progress"`
	UpdatedAt time.Time `json:"updated_at"`
}

type GetTasks struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	Sessions  int       `json:"sessions"`
	Progress  int       `json:"progress"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
