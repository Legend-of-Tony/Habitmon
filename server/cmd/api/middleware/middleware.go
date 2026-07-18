package middleware

import (
	"context"
	"net/http"

	"github.com/legend-of-tony/Habitmon/internal/auth"
)

type contextKey string

const userIDKey contextKey = "userID"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "missing authorization token", http.StatusUnauthorized)
			return
		}
		userID, err := auth.VerifyToken(cookie.Value)
		if err != nil {
			http.Error(w, "invalid authorization token", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), userIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserID(r *http.Request) (int, bool) {
	userID, ok := r.Context().Value(userIDKey).(int)
	return userID, ok
}
