require('colors');

var program = require('commander'),
	P = require('bluebird'),
	login = P.promisifyAll(require("facebook-chat-api"));

var login_conf = require('./login_conf.json');

program
  .version(require('./package.json').version)
  .parse(process.argv);
 
// Create simple echo bot 
login(login_conf, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message) {
      if(!err) {
        console.log(message);
        if(message.body) {
          if (message.body == 'Bobi?') api.sendMessage(message.senderName + '?', message.threadID);
          if (message.body.match(/pute/g)) api.sendMessage('C\'est ' + message.senderName + ' la pute', message.threadID);
          if (message.body == 'Biere?') api.sendMessage('Chaud!', message.threadID);
          if (message.body.match(/[?]/g)) api.sendMessage(Math.floor((Math.random() * 10))%2 ? 'oui' : 'non', message.threadID);
        }
      }
    });
});