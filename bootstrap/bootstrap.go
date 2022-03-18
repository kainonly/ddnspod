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
	UseObserved,
	UseDnspod,
	UseWebhook,
)

// SetValues 初始化配置
func SetValues() (values *common.Values, err error) {
	if _, err = os.Stat("./config/config.yml"); os.IsNotExist(err) {
		err = errors.New("静态配置不存在，请检查路径 [./config/config.yml]")
		return
	}
	var b []byte
	b, err = ioutil.ReadFile("./config/config.yml")
	if err != nil {
		return
	}
	err = yaml.Unmarshal(b, &values)
	if err != nil {
		return
	}
	return
}

// UseObserved 观察客户端，用于返回真实客户端 IP
// 需要响应值是 JSON 且包含客户端 ip，例如：
// GET https://api.kainonly.com
// Accept: application/json
//
// HTTP/1.1 200 OK
// Alt-Svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
// Content-Length: 75
// Content-Type: application/json; charset=utf-8
// Date: Fri, 18 Mar 2022 01:02:28 GMT
// X-Request-Id: 4628ce86-6c4c-43c5-b6fc-10b662c7057e
//
// {
// 	"ip": "xxx.xxx.xxx.xxx",
// 	"name": "api",
// 	"time": "2022-03-18T01:02:28.487910218Z"
// }
func UseObserved(values *common.Values) *common.Observed {
	return &common.Observed{
		Client: resty.New().
			SetBaseURL(values.Url),
		Path: values.Path,
	}
}

// UseDnspod API
// 使用文档：https://docs.dnspod.cn/api/
func UseDnspod(values *common.Values) *common.Dnspod {
	return &common.Dnspod{
		Client: resty.New().
			SetBaseURL("https://dnsapi.cn"),
		Values: values.Dnspod,
	}
}

// UseWebhook 自定义回调，当 IP 变更成功后触发
// 例如：动态修改网络安全组
func UseWebhook(values *common.Values) *common.Webhook {
	return &common.Webhook{
		Client: resty.New().
			SetBaseURL(values.Url),
		Path: values.Path,
	}
}
