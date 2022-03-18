package app

import (
	"ddnspod/common"
	"github.com/google/wire"
	"github.com/robfig/cron/v3"
	"log"
)

var Provides = wire.NewSet(
	wire.Struct(new(Task), "*"),
	wire.Struct(new(Service), "*"),
	New,
)

func New(
	values *common.Values,
	service *Service,
	task *Task,
) (c *cron.Cron, err error) {
	if err = service.SetRecord(); err != nil {
		return
	}
	log.Printf("获取记录ID [%s] 记录值 <%s>", values.Record.Id, values.Record.Value)
	c = cron.New(cron.WithSeconds())
	if _, err = c.AddFunc(values.Cron, task.Run); err != nil {
		return
	}
	return
}
