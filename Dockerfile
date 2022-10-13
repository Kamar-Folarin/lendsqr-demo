FROM node:16.17-buster


WORKDIR /usr/src/app


RUN apt-get update
RUN apt-get install lsb-release -y

COPY package*.json ./
COPY yarn.lock ./

RUN yarn add bcrypt

RUN yarn 

COPY . .

EXPOSE 3010

RUN yarn build

RUN yarn 

CMD [ "yarn", "start" ]

 