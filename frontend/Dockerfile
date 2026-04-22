FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Remove Caddy and use a simple preview or custom CMD if needed
EXPOSE 3000
CMD ["npm", "run", "preview"]