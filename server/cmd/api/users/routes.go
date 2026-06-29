package users

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func Routes(db *sql.DB) http.Handler {
	h := &UserHandler{db: db}
	r := chi.NewRouter()
	r.Post(Register, h.CreateUser)
	//r.Post(Login, h.LoginUser)
	//r.Put(ByID, h.UpdateUser)
	//r.Get(ByID, h.GetUser)
	//r.Delete(ByID, h.DeleteUser)
	return r
}
