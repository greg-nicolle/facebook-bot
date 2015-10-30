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
        //api.sendMessage(message.body, message.threadID);
	console.log(message);
    });
});
