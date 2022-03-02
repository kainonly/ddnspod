package main

import (
	"ddnspod/bootstrap"
	"os"
	"os/signal"
)

func main() {
	values, err := bootstrap.SetValues()
	if err != nil {
		panic(err)
	}

	c, err := Schedule(values)
	if err != nil {
		panic(err)
	}
	c.Start()

	exit := make(chan os.Signal, 1)
	signal.Notify(exit, os.Interrupt)
	<-exit
}
