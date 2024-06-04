package app

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/wire"
	"github.com/kainonly/ddnspod/common"
	"net/http"
	"net/url"
	"time"
)

var Provides = wire.NewSet(
	wire.Struct(new(App), "*"),
)

type App struct {
	Values *common.Values
}

func (x *App) Run() (ticker *time.Ticker, err error) {
	if err = x.SetRecord(); err != nil {
		return
	}
	println("[%s]: 获取记录ID <%s> 记录值 <%s>",
		time.Now().Format("2006/01/02 15:04:05"),
		x.Values.Record.Id,
		x.Values.Record.Value,
	)
	// 定时监听
	ticker = time.NewTicker(x.Values.Duration)
	for range ticker.C {
		// 异常直接终止
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
	println("[%s]: 监听IP <%s>", time.Now().Format("2006/01/02 15:04:05"), ip)
	if x.Values.Record.Value == ip {
		return
	}
	if err = x.RecordModify(ip); err != nil {
		return
	}
	println("[%s]: 域名记录值变更 <%s>", time.Now().Format("2006/01/02 15:04:05"), ip)
	return
}

type IpDto struct {
	Headers struct {
		Ip []string `json:"X-Real-Ip"`
	} `json:"headers"`
}

// FetchIp 用于返回真实客户端 IP
// 使用 https://hub.docker.com/r/traefik/whoami
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

type StatusDto struct {
	Code string `json:"code"`
}

type RecordListDto struct {
	Status  StatusDto   `json:"status"`
	Records []RecordDto `json:"records"`
}

type RecordDto struct {
	Id    string `json:"id"`
	Value string `json:"value"`
}

// BaseURL 使用文档：https://docs.dnspod.cn/api/
func (x *App) dnspod(path string) string {
	return fmt.Sprintf(`https://dnsapi.cn/%s`, path)
}

// SetRecord 获取域名记录信息并暂存状态
func (x *App) SetRecord() (err error) {
	var resp *http.Response
	if resp, err = http.PostForm(x.dnspod("Record.List"),
		url.Values{
			"login_token": []string{x.Values.Dnspod.Token},
			"format":      []string{"json"},
			"domain":      []string{x.Values.Dnspod.Domain},
			"sub_domain":  []string{x.Values.Dnspod.Record},
			"record_type": []string{"A"},
		},
	); err != nil {
		return
	}
	var data RecordListDto
	if err = json.NewDecoder(resp.Body).
		Decode(&data); err != nil {
		return
	}
	if data.Status.Code != "1" {
		return errors.New("获取记录列表请求失败")
	}
	if len(data.Records) == 0 {
		return errors.New("域名不存在相关记录")
	}
	x.Values.SetRecord(data.Records[0].Id, data.Records[0].Value)
	return
}

type RecordModifyDto struct {
	Status StatusDto `json:"status"`
}

// RecordModify 修改记录值
func (x *App) RecordModify(value string) (err error) {
	var resp *http.Response
	if resp, err = http.PostForm(x.dnspod("Record.Modify"), url.Values{
		"login_token": []string{x.Values.Dnspod.Token},
		"format":      []string{"json"},
		"domain":      []string{x.Values.Dnspod.Domain},
		"record_id":   []string{x.Values.Record.Id},
		"record_type": []string{"A"},
		"record_line": []string{"默认"},
		"value":       []string{value},
		"mx":          []string{"0"},
	}); err != nil {
		return
	}
	var data RecordModifyDto
	if err = json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return
	}
	if data.Status.Code != "1" {
		return errors.New("记录修改请求失败")
	}
	x.Values.Record.Value = value
	return
}
