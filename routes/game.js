
var utility = require('../static/js/utility');
var logObject = utility.logObject;
var log = utility.log;
module.exports = function(server) {
  server.get('/:game', function(req,res){
    var userList = global.userList;
      res.render('index.jade', {
        locals : {
                 uniqueKey: null
                 ,username: null
                 ,messages: (req.session.messages) ? JSON.stringify(req.session.messages) : '{}'
                 ,userlist: userList
                 ,title : req.params.game
                 ,description: req.params.game
                 ,author: 'Patrick Smith'
                 ,analyticssiteid: 'XXXXXXX' 
                }
      });
    });

  server.get('/:game/generateKey', function(req,res){
    var uniqueKeyIndex = global.uniqueKeyIndex;
    var uniqueKey = uniqueKeyIndex.toString(36);
    uniqueKeyIndex += Math.floor(Math.random() * 10);
    res.send(uniqueKey);
  });

  server.get('/:game/lobby/:uniqueKey', function(req,res){
    var uniqueKey = req.params.uniqueKey;
    var games = global.games;
    var GameState = global.GameState;
    log(logObject(games[uniqueKey]));
    if (typeof games[uniqueKey] !== 'undefined' && games[uniqueKey].state != GameState.WAITING_FOR_PLAYERS) {
      //game already started, redirect to new game screen, send error msg
      log('uniqueKey handler: ' + logObject(games[uniqueKey]));
      req.session.messages = {errorMsg: 'Sorry, that game has already started. Please start a new game.'};
      res.redirect('/' + req.params.game);
    } else {
      req.session.messages = {};
      res.render('index.jade', {
        locals : {
                  uniqueKey: uniqueKey
                 ,username: null
                 ,messages: '{}'
                 ,userlist: userList
                 ,title : req.params.game
                 ,description: req.params.game
                 ,author: 'Patrick Smith'
                 ,analyticssiteid: 'XXXXXXX' 
                }
      });
    }
  });
};