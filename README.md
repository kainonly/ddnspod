# DDNSPod

如果你的路由器不支持 DNSPod 的 DDNS，可以使用该程序达到相同效果，配置说明

```yaml
url: "..." # 返回真实客户端的网络地址
cron: "@every 5s" # 每5秒检测一次
dnspod:
  token: "<id>,<token>"
  domain: "awesome.com"
  record: "@"

## Hook 自定义回调，当 IP 变更成功后触发并发送 Pulsar 队列
## 个人试验，例如：本地 IP 发生变动自动变更线上服务器安全组、白名单等等
## 场景类似不妨采用 TDMQ Pulsar 配合云函数实现
pulsar:
  url:
  token:
  topic:
```

用于返回真实客户端 IP 需要响应值是 JSON 且包含客户端 ip，例如：

```http request
GET https://api.kainonly.com
Accept: application/json

// HTTP/1.1 200 OK
// Alt-Svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
// Content-Length: 75
// Content-Type: application/json; charset=utf-8
// Date: Fri, 18 Mar 2022 01:02:28 GMT
// X-Request-Id: 4628ce86-6c4c-43c5-b6fc-10b662c7057e
// {
// 	"ip": "xxx.xxx.xxx.xxx",
// 	"name": "api",
// 	"time": "2022-03-18T01:02:28.487910218Z"
// }
```