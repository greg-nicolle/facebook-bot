require('colors');

var program = require('commander'),
	P = require('bluebird'),
	login = P.promisifyAll(require("facebook-chat-api"));

var db = require('./db.js');

var login_conf = require('./login_conf.json');

var insults = require('./insults.json');

program
  .version(require('./package.json').version)
  .parse(process.argv);

var threadID = 868092476613506;

// Create simple echo bot 
login(login_conf, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message) {
      if(!err) {
        console.log(message);
        if(message.body) {
         // db.newMessage(message);
          if (message.body == 'Bobi?') api.sendMessage(message.senderName + '?', message.threadID);
          if (message.body == 'Biere?') api.sendMessage('C\'est mort aujourd\'hui c\'est beaujolais!', message.threadID);//TODO ?

          new Promise(function(resolve,reject){
            insults.some(ins => message.body.toLowerCase().match(new RegExp(ins,'g')))? reject(message) : resolve(message)
          })
              .catch(function(msg) {
api.sendMessage(msg.senderName + ' c\'est pas bien d\'insulter les gens', msg.threadID); 
return Promise.reject();
})
              .then(function() {
                if (message.body.match(/[?]/g)) {
                  if(message.body.match(/heure/g)) {
                    api.sendMessage('vers '+Math.floor((Math.random() * 100))%24+' heure', message.threadID);
                  } else if(message.body.match(/quand/g)||message.body.match(/Quand/g)) {
                    api.sendMessage('Dans '+Math.floor((Math.random() * 100))%59+' minutes', message.threadID);
                  } else if(message.body.match(/qui/g)||message.body.match(/Qui/g)) {
                    api.sendMessage(''+message.participantNames[Math.floor((Math.random() * 100))%message.participantNames.length-1]+'', message.threadID);
                  } else {
                    api.sendMessage(Math.floor((Math.random() * 10))%2 ? 'oui' : 'non', message.threadID);
                  }
                }
              })


        }
      }
    });
});
