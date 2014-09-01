
var   utility = require('../static/js/utility')
    , resources = require('../static/js/games/resources');


var logObject = utility.logObject;
var log = utility.log;

var getGameResources = function(game) {
	var gameResources = resources.gameResources;
   	return gameResources[game];
}

module.exports = function(server) {
  server.get('/:game', function(req,res){
    var userList = global.userList;
    var GameState = global.GameState;
   	var gameResources = getGameResources(req.params.game);
   	var lobbies = [];
   	for (var game in global.games) {
   		if (global.games[game].state === GameState.WAITING_FOR_PLAYERS) {
   			lobbies.push({'key': game});
   		}
   	}

    if (typeof gameResources !== 'undefined') {
      res.render('index.jade', {
          locals : {
              uniqueKey: null
             ,username: null
             ,lobbies: lobbies.length > 0 ? lobbies : null
             ,gameResources: gameResources
             ,messages: (req.session.messages) ? JSON.stringify(req.session.messages) : '{}'
             ,userlist: userList
             ,title : req.params.game
             ,description: req.params.game
             ,author: 'Patrick Smith'
             ,analyticssiteid: 'XXXXXXX' 
            }
        });
    } else {
      res.redirect('/');
    }
  });

  server.get('/:game/generateKey', function(req,res){
    var uniqueKeyIndex = global.uniqueKeyIndex;
    var uniqueKey = uniqueKeyIndex.toString(36);
    global.uniqueKeyIndex += Math.floor(Math.random() * 10);
    res.send(uniqueKey);
  });

  server.get('/:game/lobby', function(req, res){
  	res.redirect('/' + req.params.game);
  });

  server.get('/:game/lobby/:uniqueKey', function(req,res){
    var uniqueKey = req.params.uniqueKey;
    var games = global.games;
    var GameState = global.GameState;
    var gameResources = getGameResources(req.params.game);
    if (typeof gameResources === 'undefined') {
      res.redirect('/');
    } else {
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
             		 ,lobbies: null
                   ,gameResources: gameResources
                   ,messages: '{}'
                   ,userlist: userList
                   ,title : req.params.game
                   ,description: req.params.game
                   ,author: 'Patrick Smith'
                   ,analyticssiteid: 'XXXXXXX' 
                  }
        });
      }
    }
  });
};