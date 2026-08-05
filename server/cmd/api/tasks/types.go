package tasks

import "database/sql"

type ResponseStatus struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
}

type Tasks struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
	Sessions  int    `json:"sessions"`
	Progress  int    `json:"progress"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type TaskHandler struct {
	db *sql.DB
}

type CreateTaskRequest struct {
	Title    string `json:"title"`
	Sessions int    `json:"sessions"`
}

type UpdateTaskRequest struct {
	ID       *int    `json:"id"`
	Title    *string `json:"title"`
	Sessions *int    `json:"sessions"`
}

type UpdateTaskResponse struct {
	Title     string `json:"title"`
	Sessions  int    `json:"sessions"`
	UpdatedAt string `json:"updated_at"`
}

type GetTasks struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
	Sessions  int    `json:"sessions"`
	Progress  int    `json:"progress"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
