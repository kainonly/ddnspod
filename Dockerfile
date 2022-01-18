FROM alpine:edge

COPY dist /app
WORKDIR /app

CMD [ "./main" ]