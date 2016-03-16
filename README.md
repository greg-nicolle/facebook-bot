# facebook-bot
[![Build Status](https://travis-ci.org/greg-nicolle/facebook-bot.svg?branch=master)](https://travis-ci.org/greg-nicolle/facebook-bot)
[Codacy](https://www.codacy.com/app/gnicolle/facebook-bot/dashboard)
## Usage

### Install

#### Using Git

Clone the repository and run the following command:

```shell
$ npm install
```

#### Using Docker

[Docker repo](https://hub.docker.com/r/gregncll/faceboot-bot/)

```shell
docker pull gregncll/faceboot-bot
```

### Start

#### Using npm

Just do

```shell
$ npm start -- --password your_password --email your_email
```

#### Using Docker
```shell
docker run -e PASSWORD="your_password" -e EMAIL="your_email" gregncll/faceboot-bot
```

### To deploy bobi on prod

install ansible and do:

```shell
$ npm run deploy
```