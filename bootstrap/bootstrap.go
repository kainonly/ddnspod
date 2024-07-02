package bootstrap

import (
	"fmt"
	"github.com/kainonly/ddnspod/common"
	dnspodCommon "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	dnspod "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/dnspod/v20210323"
	"gopkg.in/yaml.v3"
	"os"
)

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

func UseDnspod(values *common.Values) (*dnspod.Client, error) {
	credential := dnspodCommon.NewCredential(
		values.Dns.SecretId,
		values.Dns.SecretKey,
	)
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = "dnspod.tencentcloudapi.com"
	return dnspod.NewClient(credential, "", cpf)
}
