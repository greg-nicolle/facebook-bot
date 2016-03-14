# facebook-bot
[![Build Status](https://travis-ci.org/greg-nicolle/facebook-bot.svg?branch=master)](https://travis-ci.org/greg-nicolle/facebook-bot)
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
docker run gregncll/faceboot-bot -e PASSWORD=your_password -e EMAIL=your_email
```

### To deploy bobi on prod

install ansible and do:

```shell
$ npm run deploy
```