package common

type Values struct {
	Url     string        `yaml:"url"`
	Cron    string        `yaml:"cron"`
	Dnspod  DnspodValues  `yaml:"dnspod"`
	Webhook WebhookValues `yaml:"webhook"`
	Record  *Record       `yaml:"-"`
}

type DnspodValues struct {
	Token  string `yaml:"token"`
	Domain string `yaml:"domain"`
	Record string `yaml:"record"`
}

type WebhookValues struct {
	Url    string `yaml:"url"`
	Secret string `yaml:"secret"`
}

type Record struct {
	Id    string
	Value string
}

func (x *Values) SetRecord(id string, value string) {
	x.Record = &Record{Id: id, Value: value}
}
