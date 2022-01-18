package schedule

import (
	"ddnspod/common"
	"github.com/google/wire"
	"github.com/robfig/cron/v3"
	"log"
)

var Provides = wire.NewSet(
	wire.Struct(new(Task), "*"),
	New,
)

func New(values *common.Values, dnspod *common.Dnspod, task *Task) (c *cron.Cron, err error) {
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
	Values  *common.Values
	Dnspod  *common.Dnspod
	Webhook *common.Webhook
}

func (x *Task) Run() {
	defer func() {
		if err := recover(); err != nil {
			log.Println(err)
		}
	}()
	log.Println("Task.Run->")
	data, err := x.Webhook.Get()
	if err != nil {
		panic(err)
	}
	log.Println("Webhook.Ip", data.Ip)
	if x.Dnspod.RecordValue == data.Ip {
		return
	}
	if err = x.Dnspod.Modify(data.Ip); err != nil {
		panic(err)
	}
}
