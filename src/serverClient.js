var request = require('request'),
    bunyan = require('bunyan');

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

exports.sendNewMessage = function (msg, url) {
  request.post({
    url: url, form: {
      message: {
        threadID: msg.threadID,
        senderID: msg.senderID,
        body: msg.body,
        threadName: msg.threadID,
        messageID: msg.messageID,
        timestamp: msg.timestamp
      }
    }
  }, function (err) {
    log.error(err);
  });
};