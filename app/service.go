package app

import (
	"context"
	"ddnspod/common"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/apache/pulsar-client-go/pulsar"
	"net/http"
	"net/url"
)

type Service struct {
	*common.Values
	Pulsar pulsar.Client
}

type IpDto struct {
	Ip string `json:"ip"`
}

// FetchIp 用于返回真实客户端 IP
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
func (x *Service) FetchIp() (ip string, err error) {
	var resp *http.Response
	if resp, err = http.Get(x.Url); err != nil {
		return
	}
	var body IpDto
	if err = json.NewDecoder(resp.Body).
		Decode(&body); err != nil {
		return
	}
	return body.Ip, nil
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
func (x *Service) dnspod(path string) string {
	return fmt.Sprintf(`https://dnsapi.cn/%s`, path)
}

// SetRecord 获取域名记录信息并暂存状态
func (x *Service) SetRecord() (err error) {
	var resp *http.Response
	if resp, err = http.PostForm(x.dnspod("Record.List"),
		url.Values{
			"login_token": []string{x.Dnspod.Token},
			"format":      []string{"json"},
			"domain":      []string{x.Dnspod.Domain},
			"sub_domain":  []string{x.Dnspod.Record},
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
func (x *Service) RecordModify(value string) (err error) {
	var resp *http.Response
	if resp, err = http.PostForm(x.dnspod("Record.Modify"), url.Values{
		"login_token": []string{x.Dnspod.Token},
		"format":      []string{"json"},
		"domain":      []string{x.Dnspod.Domain},
		"record_id":   []string{x.Record.Id},
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

// Hook 自定义回调，当 IP 变更成功后触发
func (x *Service) Hook(ip string) (err error) {
	var producer pulsar.Producer
	if producer, err = x.Pulsar.CreateProducer(pulsar.ProducerOptions{
		Topic: x.Values.Pulsar.Topic,
	}); err != nil {
		return
	}
	defer producer.Close()
	if _, err = producer.Send(context.TODO(), &pulsar.ProducerMessage{
		Payload: []byte(ip),
	}); err != nil {
		return
	}
	return
}
