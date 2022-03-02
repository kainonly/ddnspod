# DDNSPod

如果你的路由器不支持 DNSPod 的 DDNS，可以使用该程序达到相同效果，配置说明

```yaml
url: "..." # 需要响应值是 JSON 包含客户端 ip 的网络回调
path: "/"
cron: "@every 5s" # 每5秒检测一次
dnspod:
  token: "<id>,<token>"
  domain: "youself.com"
  record: "@"
```