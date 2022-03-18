package common

import (
	"encoding/json"
	"errors"
	"github.com/go-resty/resty/v2"
	"github.com/sirupsen/logrus"
)

type Dnspod struct {
	Client      *resty.Client
	Values      DnspodValues
	RecordId    string
	RecordValue string
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

func (x *Dnspod) Get() (err error) {
	var resp *resty.Response
	if resp, err = x.Client.R().
		SetFormData(map[string]string{
			"login_token": x.Values.Token,
			"format":      "json",
			"domain":      x.Values.Domain,
			"sub_domain":  x.Values.Record,
			"record_type": "A",
		}).
		Post("Record.List"); err != nil {
		return
	}
	var data RecordListDto
	if err = json.Unmarshal(resp.Body(), &data); err != nil {
		return
	}
	if data.Status.Code != "1" {
		return errors.New("获取记录列表请求失败")
	}
	if len(data.Records) == 0 {
		return errors.New("域名不存在相关记录")
	}
	x.RecordId = data.Records[0].Id
	x.RecordValue = data.Records[0].Value
	logrus.Infof("获取记录ID [%s] 记录值 <%s>", x.RecordId, x.RecordValue)
	return
}

type RecordModifyDto struct {
	Status StatusDto `json:"status"`
}

func (x *Dnspod) Modify(value string) (err error) {
	var resp *resty.Response
	if resp, err = x.Client.R().
		SetFormData(map[string]string{
			"login_token": x.Values.Token,
			"format":      "json",
			"domain":      x.Values.Domain,
			"record_id":   x.RecordId,
			"record_type": "A",
			"record_line": "默认",
			"value":       value,
			"mx":          "0",
		}).
		Post("Record.Modify"); err != nil {
		return
	}
	var data RecordModifyDto
	if err = json.Unmarshal(resp.Body(), &data); err != nil {
		return
	}
	if data.Status.Code != "1" {
		return errors.New("记录修改请求失败")
	}
	x.RecordValue = value
	logrus.Warningf("记录值变更 <%s>", x.RecordValue)
	return
}
