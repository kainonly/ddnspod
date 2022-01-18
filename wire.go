//go:build wireinject

package main

import (
	"ddnspod/bootstrap"
	"ddnspod/common"
	"ddnspod/schedule"
	"github.com/google/wire"
	"github.com/robfig/cron/v3"
)

func Schedule(value *common.Values) (*cron.Cron, error) {
	wire.Build(
		bootstrap.Provides,
		schedule.Provides,
	)
	return &cron.Cron{}, nil
}
