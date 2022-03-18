//go:build wireinject

package main

import (
	"ddnspod/app"
	"ddnspod/bootstrap"
	"ddnspod/common"
	"github.com/google/wire"
	"github.com/robfig/cron/v3"
)

func Schedule(value *common.Values) (*cron.Cron, error) {
	wire.Build(
		bootstrap.Provides,
		app.Provides,
	)
	return &cron.Cron{}, nil
}
