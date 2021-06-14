FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN yarn install --frozen-lockfile
RUN yarn run build

USER node

CMD ["node", "."]
