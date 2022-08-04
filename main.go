package main

import (
	"github.com/kainonly/ddnspod/bootstrap"
	"os"
	"os/signal"
)

func main() {
	app, err := bootstrap.OkLetsGo()
	if err != nil {
		panic(err)
	}

	if _, err = app.Run(); err != nil {
		panic(err)
	}

	exit := make(chan os.Signal, 1)
	signal.Notify(exit, os.Interrupt)
	<-exit
}
