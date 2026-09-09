package creatures

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestStarterRequiresAuthentication(t *testing.T) {
	for _, cookie := range []string{"", "token=invalid"} {
		req := httptest.NewRequest(http.MethodPost, "/starter", nil)
		if cookie != "" {
			req.Header.Set("Cookie", cookie)
		}
		response := httptest.NewRecorder()
		Routes(nil).ServeHTTP(response, req)
		if response.Code != http.StatusUnauthorized {
			t.Fatalf("got %d", response.Code)
		}
	}
}
