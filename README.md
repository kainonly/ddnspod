# DDNSPod

如果你的路由器不支持 DNSPod 的 DDNS，可以使用该程序达到相同效果，返回真实客户端 IP
采用 https://hub.docker.com/r/traefik/whoami 支持，配置说明

```yaml
url: "...<网络回调地址>"
duration: "5s"
dns:
  secret_id: ""
  secret_key: ""
  domain: "youself.com"
  record: "@"
  record_id: ""
```

为兼容EdgeOne或全站加速等服务，需要将自定义IP头部设置为 `X-Client-Ip`，`X-Forwarded-For` 与 `X-Real-Ip` 将不可用