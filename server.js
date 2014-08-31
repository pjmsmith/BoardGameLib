//setup Dependencies
var   connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081)
    , utility = require('./static/js/utility')
    , Game = require('./static/js/classes/game');

var log = utility.log;
var logObject = utility.logObject;

var NotFound = function(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}
global.NotFound = NotFound;

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "j9wf349fioajf9q4jfajefw98wefj"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen(port);
var routes = require('./routes')(server);

//Setup Socket.IO
var io = io.listen(server, {log: utility.debug});
io.set('close timeout', 60);
io.set('heartbeat timeout', 15);
var games = {};
var userList = {};
var userCount = 0;
var uniqueKeyIndex = Math.pow(10, 8);
var GameState = {
   WAITING_FOR_PLAYERS: 1
  ,STARTED: 2
  ,FIINISHED: 3
};
//assign to globals
global.games = games;
global.userList = userList;
global.userCount = userCount;
global.uniqueKeyIndex = uniqueKeyIndex;
global.GameState = GameState;


//sockets
io.sockets.on('connection', function(socket){

  log('Client Connected');

  var loginUser = function(data) {

    var userSession = data.user;
    var game = data.game;
    //add to global user list
    userList[socket.id] = {
       username: userSession
      ,id: socket.id
      ,game: game
    }
    socket.nickname = userSession;
    userCount++;
    log('loginUser userList: ' + logObject(userList));
    if (typeof games[game] === 'undefined') {
      games[game] = {
         userList: {}
        ,userCount: 0
        ,state: GameState.WAITING_FOR_PLAYERS
      }
      log('loginUser created new game: ' + game);
    }

    if (typeof games[game].userList[userSession] !== 'undefined' && games[game].userList[userSession].id !== socket.id ) {
      log('duplicate username');
      log(logObject(games[game].userList));
      //collision - let's keep names unique so we can easily target specific users
      socket.emit('loginError', { 
        error: 'Please choose a unique name.'
      });
    } else {
      log('unique user, join game');
      if (games[game].state === GameState.WAITING_FOR_PLAYERS) {
        //add to game's user list
        games[game].userList[userSession] = userList[socket.id];
        games[game].userList[userSession].ready = false;
        games[game].userCount++;
        log('loginUser game: ' + logObject(games[game]));
        log('login request from ' + socket.nickname);

        //join game - new room
        socket.join(game);

        io.sockets.in(game).emit('updatebuddies', {
          users: games[game].userList,
          newUser: userSession
        });
        socket.emit('loginSuccess', {}); 
        socket.emit('updatebuddies', {
          users: games[game].userList,
          newUser: userSession
        });
        log('Users:' + userCount);
      } else {
        //send error to socket
        socket.emit('loginError', { 
          error: 'Sorry, this game has already started. Join a new lobby.'
        });
      }
    }

  };

  socket.on('login', loginUser);
    
  socket.on('doAction', function(data) {
    log('doing action');
  });
  
  socket.on('ready', function(data) {
    if (typeof games[data.game] !== 'undefined') {
      var startGame = true;
      var game = games[data.game];
      log('ready: ' + logObject(game));
      if (typeof game.userList[data.user] !== 'undefined') {
        game.userList[data.user].ready = true;
        for (var username in game.userList) {
          var user = game.userList[username];
          if (typeof user !== 'undefined') {
            startGame &= user.ready;
          }
          if (!startGame) {
            break;
          }
        }
      } else {
        startGame = false;
      }
      
      if (startGame) {
        game.state = GameState.STARTED;
        io.sockets.in(data.game).emit('startGame', {
        }); 
      } else {
        game.state = GameState.WAITING_FOR_PLAYERS;
        io.sockets.in(data.game).emit('ready', {
          readyUser: data.user
        }); 
      }
      
    }
  });

  socket.on('disconnect', function(){
    log('Client Disconnected.');
    var leftUser = socket.nickname;
    if (typeof userList[socket.id] !== 'undefined') {
      var usersGame = userList[socket.id].game;
      if (typeof games[usersGame] !== 'undefined') {
        log('disconnect: ' + logObject(games[usersGame]));
        log(socket.nickname + ' disconnected');
        games[usersGame].userList[socket.nickname] = undefined;

        socket.leave(usersGame);

        if (games[usersGame].userCount > 0) {
          games[usersGame].userCount--;
        }
        if (games[usersGame].userCount <= 0) {
          games[usersGame] = undefined;
          delete games[usersGame];
        } else {
          var startGame = true;
          for (var user in games[usersGame].userList) {
            var user = games[usersGame].userList[user];
            if (typeof user !== 'undefined' && !user.ready) {
              startGame = false;
              break;
            }
          }
          if (startGame) {
            games[usersGame].state = GameState.STARTED;
            io.sockets.in(usersGame).emit('startGame');
          }
          io.sockets.in(usersGame).emit('logout', {
            leftUser: leftUser,
            users: games[usersGame].userList
          });
          log(leftUser + ' left game ' + usersGame)
        }
      }
      userList[socket.id] = undefined;
      if (userCount > 0) {
        userCount--;
      }
    } else {
      log('orphan session disconnceted');
    }
  });
});

log('Listening on http://127.0.0.1:' + port );
