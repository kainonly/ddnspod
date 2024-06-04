#!/bin/sh

export GOARCH=arm64
export GOOS=linux

go build -o dist/ddnspod-arm64 main.go
