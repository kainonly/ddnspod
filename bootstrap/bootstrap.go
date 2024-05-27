package bootstrap

import (
	"fmt"
	"github.com/google/wire"
	"github.com/kainonly/ddnspod/common"
	"gopkg.in/yaml.v3"
	"os"
)

var Provides = wire.NewSet(LoadValues)

// LoadValues 加载静态配置
// 默认配置路径 ./config/config.yml
func LoadValues() (values *common.Values, err error) {
	path := "./config/config.yml"
	if _, err = os.Stat(path); os.IsNotExist(err) {
		return nil, fmt.Errorf("静态配置不存在，请检查路径 [%s]", path)
	}
	var b []byte
	if b, err = os.ReadFile(path); err != nil {
		return
	}
	if err = yaml.Unmarshal(b, &values); err != nil {
		return
	}
	return
}
