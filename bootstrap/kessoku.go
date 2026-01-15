//go:generate go tool kessoku $GOFILE

package bootstrap

import (
	"github.com/kainonly/ddnspod/app"
	"github.com/mazrean/kessoku"
)

var _ = kessoku.Inject[*app.App](
	"OkLetsGo",
	kessoku.Provide(LoadValues),
	kessoku.Provide(UseDnspod),
	kessoku.Provide(app.NewApp),
)
