package common

import "time"

type Values struct {
	Url      string        `yaml:"url"`
	Duration time.Duration `yaml:"duration"`
	Dns      TencentDNS    `yaml:"dns"`
}

type TencentDNS struct {
	SecretId  string `yaml:"secret_id"`
	SecretKey string `yaml:"secret_key"`
	Domain    string `yaml:"domain"`
	Record    string `yaml:"record"`
	RecordId  uint64 `yaml:"record_id"`
}
