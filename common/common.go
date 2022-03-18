package common

type Values struct {
	Url    string  `yaml:"url"`
	Cron   string  `yaml:"cron"`
	Dnspod Dnspod  `yaml:"dnspod"`
	Pulsar *Pulsar `yaml:"pulsar"`
	Record *Record `yaml:"-"`
}

type Dnspod struct {
	Token  string `yaml:"token"`
	Domain string `yaml:"domain"`
	Record string `yaml:"record"`
}

type Pulsar struct {
	Url   string `yaml:"url"`
	Token string `yaml:"token"`
	Topic string `yaml:"topic"`
}

type Record struct {
	Id    string
	Value string
}

func (x *Values) SetRecord(id string, value string) {
	x.Record = &Record{Id: id, Value: value}
}
