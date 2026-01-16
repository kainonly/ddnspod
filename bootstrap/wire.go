//go:build wireinject

package bootstrap

import (
	"github.com/goforj/wire"
	"github.com/kainonly/ddnspod/app"
)

func OkLetsGo() (*app.App, error) {
	wire.Build(
		LoadValues,
		UseDnspod,
		app.Provides,
	)
	return nil, nil
}
