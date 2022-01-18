package bootstrap

import (
	"ddnspod/common"
	"errors"
	"github.com/go-resty/resty/v2"
	"github.com/google/wire"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"os"
)

var Provides = wire.NewSet(
	UseWebhook,
	UseDnspod,
)

// SetValues 初始化配置
func SetValues() (values *common.Values, err error) {
	if _, err = os.Stat("./config.yml"); os.IsNotExist(err) {
		err = errors.New("the path [./config.yml] does not have a configuration file")
		return
	}
	var b []byte
	b, err = ioutil.ReadFile("./config.yml")
	if err != nil {
		return
	}
	err = yaml.Unmarshal(b, &values)
	if err != nil {
		return
	}
	return
}

func UseWebhook(values *common.Values) *common.Webhook {
	return &common.Webhook{
		Client: resty.New().
			SetBaseURL(values.Url),
		Path: values.Path,
	}
}

func UseDnspod(values *common.Values) *common.Dnspod {
	return &common.Dnspod{
		Client: resty.New().
			SetBaseURL("https://dnsapi.cn"),
		Values: values.Dnspod,
	}
}
