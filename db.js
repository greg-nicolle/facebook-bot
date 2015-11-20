var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;


db.serialize(function() {

  db.run("CREATE TABLE if not exists message (threadId INT, senderID, body TEXT, threadName TEXT, messageID TEXT, timestamp INT)");
  db.run("CREATE TABLE if not exists user_info (threadId INT, body TEXT)");
});

exports.newMessage = function(message) {
  var stmt = db.prepare("INSERT INTO message VALUES (?,?,?,?,?,?)");
  stmt.run(message.threadID, message.senderID, message.body, message.threadName, message.messageID, message.timestamp);
  stmt.finalize();
};

exports.getUsers = function() {
  var stmt = "SELECT * FROM user_info";
  db.get(stmt, function (e, r) {
    if(e) {
      util.log("ERROR - " + e);
    } else if(r) {

    }
  });
};