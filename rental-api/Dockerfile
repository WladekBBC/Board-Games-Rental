FROM node:20 AS builder
WORKDIR /app

RUN rm -rf node_modules
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "run", "start:prod"]