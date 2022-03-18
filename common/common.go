package common

type Values struct {
	Url      string    `yaml:"url"`
	Cron     string    `yaml:"cron"`
	Dnspod   Dnspod    `yaml:"dnspod"`
	Webhooks []Webhook `yaml:"webhooks"`
	Record   *Record   `yaml:"-"`
}

type Dnspod struct {
	Token  string `yaml:"token"`
	Domain string `yaml:"domain"`
	Record string `yaml:"record"`
}

type Webhook struct {
	Type   string            `yaml:"type"`
	Url    string            `yaml:"url"`
	Option map[string]string `yaml:"option"`
}

type Record struct {
	Id    string
	Value string
}

func (x *Values) SetRecord(id string, value string) {
	x.Record = &Record{Id: id, Value: value}
}
