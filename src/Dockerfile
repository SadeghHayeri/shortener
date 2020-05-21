FROM node:10

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn --production

COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]
