require('colors');
require('./src/utils.js');

var program = require('commander'),
    P = require('bluebird'),
    login = P.promisifyAll(require('facebook-chat-api')),
    bunyan = require('bunyan'),
    weather = require('weather-js');

var contains = require('./src/SmartContains').contains,
    sendMessage = require('./src/serverClient').sendNewMessage;
/**
 * Import dico
 **/
var insults = require('./dico/insults.json'),
    insultResponse = require('./dico/insult_response.json'),
    birsdayAnswer = require('./dico/birsdayAnswer.json');

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

var facebookOption = {logLevel: 'silent'};

var loginConf = {
  email: program.email,
  password: program.password
};

login(loginConf, facebookOption, function callback(err, api) {
  var myVar = setInterval(gregPute, 360000000);
  if (err) {
    return log.error(err);
  }

  var pong = function (msg) {
    api.sendMessage('pong', msg.threadID);
  };

  var randomHours = function (msg) {
    api.sendMessage('vers ' + Math.floor((Math.random() * 100)) % 24 + ' heure', msg.threadID);
  };

  var happyBirsday = function (msg) {
    api.getUserInfo(msg.senderID, function (err, resp) {
      if (resp[msg.senderID].isBirthday) {

        var nb = Math.floor((Math.random() * 100)) % birsdayAnswer.length;

        var name = (resp2.nicknames[id] && Math.floor((Math.random() * 100) % 2)) ? resp2.nicknames[id] : resp[id].firstName;
        api.sendMessage(birsdayAnswer[nb][0] + name, msg.threadID +birsdayAnswer[nb][1]);

      }
    });
  };

  var horny = function (msg) {
    api.sendMessage('Ouais chaud !', msg.threadID);
  };

  var randomTime = function (msg) {
    api.sendMessage('Dans ' + Math.floor((Math.random() * 100)) % 59 + ' minutes', msg.threadID);
  };

  var getWeather = function (msg) {
    weather.find({search: 'Paris France', degreeType: 'C', lang: 'fr'}, function (err, result) {
      if (err) {
        log.error(err);
      } else {
        var temps = result[0].current;
        api.sendMessage('C\'est ' + temps.skytext.toLowerCase() + ' et il fait ' + temps.temperature, msg.threadID);
      }
    });
  };

  var randomYesNo = function (msg) {
    api.sendMessage(Math.floor((Math.random() * 10)) % 2 ? 'oui' : 'non', msg.threadID);
  };

  var who = function (msg) {
    api.getThreadInfo(msg.threadID, function (err2, resp2) {
      var id = resp2.participantIDs[Math.floor((Math.random() * 100)) % resp2.participantIDs.length];

      api.getUserInfo(id, function (err, resp) {
        var name = (resp2.nicknames[id] && Math.floor((Math.random() * 100) % 2)) ? resp2.nicknames[id] : resp[id].firstName;
        api.sendMessage(name, msg.threadID);
      });
    });
  };

  var calmDown = function (msg) {

    // TODO Clean that

    api.getUserInfo(msg.senderID, function (err, resp) {
      api.getThreadInfo(msg.threadID, function (err2, resp2) {
        var nb = Math.floor((Math.random() * 100)) % insultResponse.length;
        var name = (resp2.nicknames[msg.senderID] && Math.floor((Math.random() * 100) % 2)) ? resp2.nicknames[msg.senderID] : resp[msg.senderID].firstName;
        if(resp[msg.senderID].isBirthday) {
          var pronom = resp[msg.senderID].gender === 1? 'le' : 'la';
          api.sendMessage('C\'est pas parce que c\'est ton anniversaire que t\'as le droit de faire ' + pronom + ' ouf ' + name, msg.threadID);
        } else {
          api.sendMessage(insultResponse[nb][0] + name + insultResponse[nb][1], msg.threadID);
        }
      });
    });
  };
	
  var gregPute = function () {
     api.sendMessage('Ta gueule Greg', msg.threadID);
  }; 



  api.listen(function callback(err, message) {
    if (!err) {
      if (message.body) {
        log.info({status: 'started'}, 'new message');

        if (!program.q) {
          sendMessage(message, program.url);
        }

        new Promise(function (resolve, reject) {
          insults.some(ins => contains(message.body, ins)) ? reject(message) : resolve(message);
        })
            .catch(function (msg) {
              calmDown(msg);
              return Promise.reject();
            })
            .then(function (msg) {

              happyBirsday(msg);

              if (msg.body.nrml() === 'ping') {
                pong(msg);
              } else if (msg.body.nrml().match(/(.*)heure(.*)\?$/) && msg.body.length > 10) {
                randomHours(msg);
              } else if (msg.body.nrml().match(/(.*)soir(.*)\?$/) && msg.body.nrml().match(/(.*)chaud(.*)\?$/)) {
                horny(msg);
              } else if (msg.body.nrml().match(/(.*)quand(.*)\?$/) && msg.body.length > 10) {
                randomTime(msg);
              } else if (msg.body.nrml().match(/(.*)qui(.*)\?/) && msg.body.length > 10) {
                who(msg);
              } else if (msg.body.nrml().match(/(.*)biere(.*)\?/)) {
                horny(msg);
              } else if (msg.body.nrml().match(/(.*)temps(.*)\?/) && !msg.body.nrml().match(/combien/g) && msg.body.length > 10) {
                getWeather(msg);
              } else if (msg.body.nrml().match(/(.*)bobi(.*)\?/)) {
                randomYesNo(msg);
              }
            });
      }
    } else {
      log.error(err);
    }
  });
});
