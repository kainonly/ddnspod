package common

type Values struct {
	Url    string       `yaml:"url"`
	Path   string       `yaml:"path"`
	Cron   string       `yaml:"cron"`
	Dnspod DnspodValues `yaml:"dnspod"`
}

type DnspodValues struct {
	Token  string `yaml:"token"`
	Domain string `yaml:"domain"`
	Record string `yaml:"record"`
}
