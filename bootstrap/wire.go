//go:build wireinject
// +build wireinject

package bootstrap

import (
	"github.com/google/wire"
	"github.com/kainonly/ddnspod/app"
)

func OkLetsGo() (*app.App, error) {
	wire.Build(
		Provides,
		app.Provides,
	)
	return &app.App{}, nil
}
