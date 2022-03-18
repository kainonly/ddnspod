package common

import (
	"encoding/json"
	"github.com/go-resty/resty/v2"
)

type Observed struct {
	Client *resty.Client
	Path   string
}

type ObservedDto struct {
	Ip string `json:"ip"`
}

func (x *Observed) Get() (data ObservedDto, err error) {
	var resp *resty.Response
	if resp, err = x.Client.R().
		Get(x.Path); err != nil {
		return
	}
	if err = json.Unmarshal(resp.Body(), &data); err != nil {
		return
	}
	return
}
