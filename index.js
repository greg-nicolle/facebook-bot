require('colors');

var program = require('commander'),
    P = require('bluebird'),
    login = P.promisifyAll(require('facebook-chat-api'));

require('./lib.js');

var weather = require('weather-js');

var request = require('request');

var insults = require('./dico/insults.json'),
    insult_response = require('./dico/insult_response.json');

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'facebook-bot',
  streams: [{
    level: 'info',
    stream: process.stdout // log INFO and above to stdout
  }, {
    level: 'error',
    stream: process.stdout // log INFO and above to stdout
  }, {
    level: 'error',
    path: './facebook-bot-error.log' // log ERROR and above to a file
  }, {
    level: 'info',
    path: './facebook-bot-info.log' // log info and above to a file
  }]
});

program
    .version(require('./package.json').version)
    .option('-l, --log [log]', 'Npm log level default silent', 'silent')
    .option('-pw, --password [password]', 'Facebook password')
    .option('-e, --email [email]', 'Facebook email')
    .option('-u, --url [url]', 'Url to notify a new message', 'http://localhost:8000/NewFacebookMessage/')
    .option('-q, --quiet', 'Don\'t notify when new message')
    .parse(process.argv);

var facebook_option = {logLevel: 'silent'};

var login_conf = {
  email: program.email,
  password: program.password
};

login(login_conf, facebook_option, function callback(err, api) {
  if (err) {
    return log.error(err);
  }

  api.listen(function callback(err, message) {
    if (!err) {
      if (message.body) {
        log.info({status: 'started'}, 'new message');

        if (!program.q) {
          request.post({
            url: program.url, form: {
              message: {
                threadID: message.threadID,
                senderID: message.senderID,
                body: message.body,
                threadName: message.threadID,
                messageID: message.messageID,
                timestamp: message.timestamp
              }
            }
          }, function (err, httpResponse, body) {
            log.error(err);
          });
        }

        new Promise(function (resolve, reject) {
          insults.some(ins => (' ' + message.body + ' ').nrml().match(new RegExp('[^\w]' + ins + '[^\w]', 'g'))) ? reject(message) : resolve(message);
        })
            .catch(function (msg) {
              var nb = Math.floor((Math.random() * 100)) % insult_response.length;
              api.sendMessage(insult_response[nb][0] + msg.senderName.split(' ')[0] + insult_response[nb][1], msg.threadID);
              return Promise.reject();
            })
            .then(function (msg) {
              if (msg.body.match(/[?]/g)) {
                if (msg.body.nrml().match(/heure/g) && msg.body.length > 10) {
                  api.sendMessage('vers ' + Math.floor((Math.random() * 100)) % 24 + ' heure', msg.threadID);
                } else if (msg.body.nrml().match(/soir/g) && msg.body.nrml().match(/chaud/g)) {
                  api.sendMessage('Ouais chaud !', msg.threadID);
                } else if (msg.body.nrml().match(/quand/g) && msg.body.length > 10) {
                  api.sendMessage('Dans ' + Math.floor((Math.random() * 100)) % 59 + ' minutes', msg.threadID);
                } else if (msg.body.nrml().match(/qui/g) && msg.body.length > 10) {
                  api.sendMessage('' + msg.participantNames[Math.floor((Math.random() * 100)) % msg.participantNames.length].split(' ')[0] + '', msg.threadID);
                } else if (msg.body.nrml().match(/biere/g)) {
                  api.sendMessage('Chaud!', msg.threadID);
                } else if (msg.body.nrml().match(/temps/g) && !msg.body.nrml().match(/combien/g) && msg.body.length > 10) {
                  weather.find({search: 'Paris France', degreeType: 'C', lang: 'fr'}, function (err, result) {
                    if (err) {
                      log.error(err);
                    } else {
                      var temps = result[0].current;
                      api.sendMessage('C\'est ' + temps.skytext + ' et il fait ' + temps.temperature, msg.threadID);
                    }
                  });
                } else if (msg.body.nrml().match(/bobi/g)) {
                  api.sendMessage(Math.floor((Math.random() * 10)) % 2 ? 'oui' : 'non', msg.threadID);
                }
              }
            });
      }
    } else {
      log.error(err);
    }
  });
});
