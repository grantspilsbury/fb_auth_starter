var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/passporttest");
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongo')
});

var FacebookUserSchema = new mongoose.Schema({
    fbId: String,
    displayName : String,
    sessionID: String
});

var User = mongoose.model('fbs',FacebookUserSchema);

const updateOrCreateUser = (query, cb) => {
  User.findOne({ fbId: query.fbId }, (err, user) => {
    if (!user) {
      let newUser = new User({
        displayName: query.displayName,
        sessionID: query.sessionID,
        fbId: query.fbId
      });
      newUser.save(function(err, user) {
        cb(err, user);
      });
    } else {
      user.sessionID = query.sessionID
      user.save(function(err, user) {
        cb(err, user);
      });
    }
  });
}

const logout = (sessionID, cb) => {
  User.update({ sessionID: sessionID }, { $set: { sessionID: '' }}, cb);
}


module.exports.updateOrCreateUser = updateOrCreateUser;
module.exports.User = User;
module.exports.logout = logout