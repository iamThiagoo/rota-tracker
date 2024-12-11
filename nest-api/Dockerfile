FROM node:20-slim

RUN apt-get update && \
    apt-get install -y openssl procps && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g @nestjs/cli@10.0.0

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD [ "tail", "-f", "/dev/null" ]