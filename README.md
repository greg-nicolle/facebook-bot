# facebook-bot
[![Build Status](https://travis-ci.org/greg-nicolle/facebook-bot.svg?branch=master)](https://travis-ci.org/greg-nicolle/facebook-bot)
## Usage

### Install

Clone the repository and run the following command:

```shell
$ npm install
```

Add facebook email and password in login_conf.json

```javascript
{
  "email": "EMAIL",
  "password": "PASSWORD"
}
```

### Start

Just do

```shell
$ npm start
```

### To deploy bobi on prod

install ansible and do:

```shell
$ npm run deploy
```