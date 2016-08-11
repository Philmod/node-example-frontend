FROM zzrot/alpine-node

# Need git for not-published npm modules
RUN apk update && \
    apk add --no-cache git openssh

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install

EXPOSE 3001

CMD [ "npm", "start"]
