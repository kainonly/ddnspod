package common

import "time"

type Values struct {
	Url      string        `yaml:"url"`
	Duration time.Duration `yaml:"duration"`
	Dnspod   Dnspod        `yaml:"dnspod"`
	Record   *Record       `yaml:"-"`
}

type Dnspod struct {
	Token  string `yaml:"token"`
	Domain string `yaml:"domain"`
	Record string `yaml:"record"`
}

type Record struct {
	Id    string
	Value string
}

func (x *Values) SetRecord(id string, value string) {
	x.Record = &Record{Id: id, Value: value}
}
