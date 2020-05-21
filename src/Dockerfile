FROM registry.gitlab.com/sadeghhayeri/shortener/node-base:14-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn --production

COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]
