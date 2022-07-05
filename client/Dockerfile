FROM node:18.3.0-alpine

WORKDIR /usr/src/app

ENV PORT 3000
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]