//setup Dependencies
var   connect = require('connect')
	, express = require('express')
	, io = require('socket.io')
	, port = (process.env.PORT || 8888)
	, utility = require('./static/js/utility')
	, Game = require('./static/js/classes/game')
	, Player = require('./static/js/classes/player');

var log = utility.log;
var logObject = utility.logObject;

var Game = Game.Game;
var Player = Player.Player;

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
	server.use(express.session({ secret: 'j9wf349fioajf9q4jfajefw98wefj'}));
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

//Setup the routes
var routes = require('./routes')(server);

//Setup Socket.IO
var io = io.listen(server, {log: utility.debug});
io.set('close timeout', 60);
io.set('heartbeat timeout', 15);

//global server variables
var games = {};
var userList = {};
var userCount = 0;
var uniqueKeyIndex = Math.pow(10, 8);
var GameState = {
	 WAITING_FOR_PLAYERS: 1
	,STARTED: 2
	,FINISHED: 3
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

		var userSession = data.user.replace(/(<([^>]+)>)/ig,'');;
		var game = data.game;
		//add to global user list
		userList[socket.id] = new Player({
			 name: userSession
			,id: socket.id
			,game: game
			,ready: false
		});
		socket.nickname = userSession;
		userCount++;
		log('loginUser userList: ' + logObject(userList));
		if (typeof games[game] === 'undefined') {
			games[game] = new Game({
				 uniqueKey: game
				,players: {}
				,numPlayers: 0
				,state: GameState.WAITING_FOR_PLAYERS
			});
			log('loginUser created new game: ' + game);
		}

		if (games[game].state === GameState.WAITING_FOR_PLAYERS) {
			if (games[game].numPlayers + 1 <= games[game].maxPlayers && games[game].getAvailablePlayerNumber()) {
				var playerNumber = games[game].getAvailablePlayerNumber();

				if (games[game].getPlayerByName(userSession)) {
					log('duplicate username');
					log(logObject(games[game].players));
					//collision - let's keep names unique so we can easily target specific users
					socket.emit('loginError', { 
						error: 'Please choose a unique name.'
					});
				} else {
					log('unique user, join game');
					//add to game's user list
					userList[socket.id].playerNumber = playerNumber;
					games[game].players[playerNumber] = userList[socket.id];
					games[game].numPlayers++;
					log('loginUser game: ' + logObject(games[game]));
					log('login request from ' + socket.nickname);

					//join game - new room
					socket.join(game);

					io.sockets.in(game).emit('updateplayers', {
						users: games[game].players,
						newUser: userSession
					});
					socket.emit('loginSuccess', {playerNumber: playerNumber}); 
					socket.emit('updateplayers', {
						users: games[game].players,
						newUser: userSession
					});
					log('Users:' + userCount);
				}
			} else {
				//send error to socket
				socket.emit('loginError', { 
					error: 'Sorry, this game is full. Join a new lobby.'
				});
			}
		} else {
			//send error to socket
			socket.emit('loginError', { 
				error: 'Sorry, this game has already started. Join a new lobby.'
			});
		}

	};

	socket.on('login', loginUser);
		
	socket.on('doAction', function(data) {
		log('doing action');
		var game = games[data.game];
		io.sockets.in(data.game).emit('applyAction', data);
	});
	
	socket.on('ready', function(data) {
		if (typeof games[data.game] !== 'undefined') {
			var startGame = true;
			var game = games[data.game];
			log('ready: ' + logObject(game));
			if (typeof data.user !== 'undefined' && typeof game.players[data.user.playerNumber] !== 'undefined') {
				game.players[data.user.playerNumber].ready = true;
				for (var number in game.players) {
					var user = game.players[number];
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
				var nextPlayer = game.getNextPlayer();
				io.sockets.in(data.game).emit('startGame', {
					 currentPlayer: nextPlayer
					,users: game.players
				}); //start with first player 
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
				for (var playerId in games[usersGame].players) {
					var player = games[usersGame].players[playerId];
					log('name: ' + socket.nickname + '; ' + 'playername: ' + player.name);
					if (player.name === socket.nickname) {
						games[usersGame].players[playerId] = undefined;
						delete games[usersGame].players[playerId];
						socket.leave(usersGame);
					}
				}
				
				if (games[usersGame].numPlayers > 0) {
					games[usersGame].numPlayers--;
				}
				if (games[usersGame].numPlayers <= 0) {
					games[usersGame] = undefined;
					delete games[usersGame];
				} else {
					var startGame = true;
					for (var playerId in games[usersGame].players) {
						var player = games[usersGame].players[playerId];
						log(logObject(player));
						if (typeof player !== 'undefined' && !player.ready) {
							log('player not ready ' + player);
							startGame = false;
							break;
						}
					}
					if (startGame) {
						log('Starting game, everyone is ready');
						games[usersGame].state = GameState.STARTED;
						var nextPlayer = games[usersGame].getNextPlayer();
						io.sockets.in(usersGame).emit('startGame', {currentPlayer: nextPlayer, users: games[usersGame].players});
					} else {
						io.sockets.in(usersGame).emit('logout', {
							leftUser: leftUser,
							users: games[usersGame].players
						});
						log(leftUser + ' left game ' + usersGame)
					}
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
