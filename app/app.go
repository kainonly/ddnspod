package app

import (
	"ddnspod/common"
	"github.com/google/wire"
	"github.com/robfig/cron/v3"
	"github.com/sirupsen/logrus"
)

var Provides = wire.NewSet(
	wire.Struct(new(Task), "*"),
	New,
)

func New(
	values *common.Values,
	dnspod *common.Dnspod,
	task *Task,
) (c *cron.Cron, err error) {
	if err = dnspod.Get(); err != nil {
		return
	}
	c = cron.New(cron.WithSeconds())
	if _, err = c.AddFunc(values.Cron, task.Run); err != nil {
		return
	}
	return
}

type Task struct {
	Values   *common.Values
	Observed *common.Observed
	Dnspod   *common.Dnspod
	Webhook  *common.Webhook
}

func (x *Task) Run() {
	data, err := x.Observed.Get()
	if err != nil {
		panic(err)
	}
	logrus.Infof("当前客户端IP <%s>", data.Ip)
	if x.Dnspod.RecordValue == data.Ip {
		return
	}
	if err = x.Dnspod.Modify(data.Ip); err != nil {
		panic(err)
	}
}
