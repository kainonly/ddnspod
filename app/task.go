package app

import (
	"ddnspod/common"
	"log"
)

type Task struct {
	Service *Service
	Values  *common.Values
}

func (x *Task) Run() {
	defer func() {
		if err := recover(); err != nil {
			log.Println(err)
		}
	}()
	ip, err := x.Service.FetchIp()
	if err != nil {
		panic(err)
	}
	log.Printf("客户端 <%s>", ip)
	if x.Values.Record.Value == ip {
		return
	}
	if err = x.Service.RecordModify(ip); err != nil {
		panic(err)
	}
	log.Printf("记录值变更 <%s>", ip)
	if x.Values.Pulsar == nil {
		return
	}
	if err = x.Service.Hook(ip); err != nil {
		panic(err)
	}
	log.Println("队列事件已发送")
}
