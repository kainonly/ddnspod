package bootstrap

import (
	"ddnspod/common"
	"errors"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"os"
)

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
