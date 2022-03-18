package bootstrap

import (
	"ddnspod/common"
	"errors"
	"github.com/apache/pulsar-client-go/pulsar"
	"github.com/google/wire"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"os"
	"time"
)

var Provides = wire.NewSet(UsePulsar)

// SetValues 初始化配置
func SetValues() (values *common.Values, err error) {
	if _, err = os.Stat("./config/config.yml"); os.IsNotExist(err) {
		err = errors.New("静态配置不存在，请检查路径 [./config/config.yml]")
		return
	}
	var b []byte
	b, err = ioutil.ReadFile("./config/config.yml")
	if err != nil {
		return
	}
	err = yaml.Unmarshal(b, &values)
	if err != nil {
		return
	}
	return
}

// UsePulsar 初始化 Pulsar
func UsePulsar(values *common.Values) (client pulsar.Client, err error) {
	if values.Pulsar == nil {
		return
	}
	option := values.Pulsar
	return pulsar.NewClient(pulsar.ClientOptions{
		URL:               option.Url,
		Authentication:    pulsar.NewAuthenticationToken(option.Token),
		OperationTimeout:  30 * time.Second,
		ConnectionTimeout: 30 * time.Second,
	})
}
