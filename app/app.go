package app

import (
	"encoding/json"
	"fmt"
	"github.com/google/wire"
	"github.com/kainonly/ddnspod/common"
	dnspodCommon "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	dnspod "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/dnspod/v20210323"
	"net/http"
	"time"
)

var Provides = wire.NewSet(
	wire.Struct(new(App), "*"),
)

type App struct {
	Values *common.Values
	Client *dnspod.Client
}

func (x *App) Run() (ticker *time.Ticker, err error) {
	ticker = time.NewTicker(x.Values.Duration)
	for range ticker.C {
		if err = x.Watch(); err != nil {
			return
		}
	}

	return
}

func (x *App) Watch() (err error) {
	var ip string
	if ip, err = x.FetchIp(); err != nil {
		return
	}
	var currentIp string
	if currentIp, err = x.DescribeRecord(); err != nil {
		return
	}
	println(fmt.Sprintf("[%s]: CurrentIP <%s> IP <%s>",
		time.Now().Format("2006/01/02 15:04:05"),
		currentIp, ip),
	)
	if currentIp == ip {
		return
	}
	if err = x.RecordModify(ip); err != nil {
		return
	}
	println(fmt.Sprintf("[%s]: Change <%s>", time.Now().Format("2006/01/02 15:04:05"), ip))
	return
}

type IpDto struct {
	Headers struct {
		Ip []string `json:"X-Client-Ip"`
	} `json:"headers"`
}

// FetchIp 使用 https://hub.docker.com/r/traefik/whoami
func (x *App) FetchIp() (ip string, err error) {
	var resp *http.Response
	if resp, err = http.Get(x.Values.Url); err != nil {
		return
	}
	var body IpDto
	if err = json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return
	}
	if len(body.Headers.Ip) == 0 {
		return "", fmt.Errorf("未获取到客户端 IP")
	}
	ip = body.Headers.Ip[0]
	return
}

func (x *App) DescribeRecord() (value string, err error) {
	request := dnspod.NewDescribeRecordRequest()
	request.Domain = dnspodCommon.StringPtr(x.Values.Dns.Domain)
	request.RecordId = dnspodCommon.Uint64Ptr(x.Values.Dns.RecordId)
	var response *dnspod.DescribeRecordResponse
	if response, err = x.Client.DescribeRecord(request); err != nil {
		return
	}
	value = *response.Response.RecordInfo.Value
	return
}

func (x *App) RecordModify(value string) (err error) {
	request := dnspod.NewModifyRecordRequest()
	request.Domain = dnspodCommon.StringPtr(x.Values.Dns.Domain)
	request.RecordType = dnspodCommon.StringPtr("A")
	request.RecordLine = dnspodCommon.StringPtr("默认")
	request.Value = dnspodCommon.StringPtr(value)
	request.RecordId = dnspodCommon.Uint64Ptr(x.Values.Dns.RecordId)
	request.SubDomain = dnspodCommon.StringPtr(x.Values.Dns.Record)
	request.TTL = dnspodCommon.Uint64Ptr(60)
	if _, err = x.Client.ModifyRecord(request); err != nil {
		return
	}
	return
}
