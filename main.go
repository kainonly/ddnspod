package main

import "ddnspod/bootstrap"

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
	select {}
}
