# DDNSPod

如果你的路由器不支持 DNSPod 的 DDNS，可以使用该程序达到相同效果，返回真实客户端 IP
采用 https://hub.docker.com/r/traefik/whoami 支持，配置说明

```yaml
url: "https://awesome.com/api" # 返回真实客户端的网络地址
duration: "5s" # 每5秒检测一次
dnspod:
  token: "<id>,<token>"
  domain: "awesome.com"
  record: "@"

```