# FROM node:23-alpine
FROM node:20-alpine3.17

WORKDIR /app

COPY package.json .

RUN npm install

COPY  . .

EXPOSE 3001

CMD ["npm", "start"]