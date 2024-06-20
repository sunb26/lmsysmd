package main

import (
	"embed"
	"net/http"

	"github.com/Lev1ty/lmsysmd/lib/handler/static"
	"github.com/ulule/limiter/v3"
)

//go:embed all:ts all:ts/_next
var ts embed.FS

func external(mux *http.ServeMux, rls limiter.Store) http.Handler {
	mux.Handle("/", static.Handler(ts, "ts"))
	return mux
}
