package common

import "github.com/go-resty/resty/v2"

type Webhook struct {
	Client *resty.Client
	Path   string
}
