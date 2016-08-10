FROM zzrot/alpine-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install

EXPOSE 3001

CMD [ "npm", "start"]
