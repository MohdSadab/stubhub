FROM node:16.13.2-slim

WORKDIR /app

COPY ./package.json .

RUN npm install --only=prod

COPY . .

CMD ["npm","start"]