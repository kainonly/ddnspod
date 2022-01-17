FROM alpine:edge

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

COPY dist /app
WORKDIR /app

CMD [ "./main" ]