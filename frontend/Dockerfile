FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# install caddy (since you’re using it)
RUN apk add --no-cache caddy

CMD ["caddy", "run", "--config", "/app/Caddyfile", "--adapter", "caddyfile"]