require('colors');

var program = require('commander'),
    P = require('bluebird'),
    login = P.promisifyAll(require("facebook-chat-api"));

require('./lib.js');

var db = require('./db.js');

var login_conf = require('./login_conf.json'),
    insults = require('./insults.json'),
    insult_response = require('./dico/insult_response.json');

program
    .version(require('./package.json').version)
    .parse(process.argv);

// Create simple echo bot
login(login_conf, function callback(err, api) {
  if (err) return console.error(err);

  api.listen(function callback(err, message) {
    if (!err) {
      console.log(message);
      if (message.body) {

        new Promise(function (resolve, reject) {
          insults.some(ins => message.body.nrml().match(new RegExp(ins, 'g')))? reject(message) : resolve(message)
        })
            .catch(function (msg) {
              var nb = Math.floor((Math.random() * 100)) % insult_response.length;
              api.sendMessage(insult_response[nb][0] + msg.senderName + insult_response[nb][1], msg.threadID);
              return Promise.reject();
            })
            .then(function (msg) {
              if (msg.body.match(/[?]/g)) {
                if (msg.body.nrml().match(/heure/g) && msg.body.length > 10) {
                  api.sendMessage('vers ' + Math.floor((Math.random() * 100)) % 24 + ' heure', msg.threadID);
                } else if (msg.body.nrml().match(/soir/g) && msg.body.nrml().match(/chaud/g)) {
                  api.sendMessage('Dans ' + Math.floor((Math.random() * 100)) % 59 + ' minutes', msg.threadID);
                } else if (msg.body.nrml().match(/quand/g) && msg.body.length > 10) {
                  api.sendMessage('Dans ' + Math.floor((Math.random() * 100)) % 59 + ' minutes', msg.threadID);
                } else if (msg.body.nrml().match(/qui/g) && msg.body.length > 10) {
                  api.sendMessage('' + msg.participantNames[Math.floor((Math.random() * 100)) % msg.participantNames.length - 1] + '', msg.threadID);
                } else if (msg.body.nrml().match(/biere/g)) {
                  api.sendMessage('C\'est mort aujourd\'hui c\'est beaujolais!', msg.threadID);
                } else if (msg.body.nrml().match(/bobi/g)) {
                  api.sendMessage(Math.floor((Math.random() * 10)) % 2 ? 'oui' : 'non', msg.threadID);
                }
              }
            })
      }
    }
  });
});
