// Code generated by Wire. DO NOT EDIT.

//go:generate go run -mod=mod github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package bootstrap

import (
	"github.com/kainonly/ddnspod/app"
)

// Injectors from wire.go:

func OkLetsGo() (*app.App, error) {
	values, err := LoadValues()
	if err != nil {
		return nil, err
	}
	appApp := &app.App{
		Values: values,
	}
	return appApp, nil
}
