
var Game = function(title, username, playerNumber, uniqueKey, connection) {
	this.title = title;
	this.username = username;
	this.playerNumber = playerNumber;
	this.uniqueKey = uniqueKey;
	this.connection = connection;
	this.players = {
		 ready: false
		,cards: []
		,pieces: []
		,state: null
	};
	this.currentPlayer = null;
	this.board = {

	};
	this.decks = {
		//cards: []
	};
	this.state = null;
	this.activePlayer = null;
	this.maxPlayers = 5;
	this.minPlayers = 2;
	this.numPlayers = 1;
	this.dice = {
		 number: 2
		,sides: 6
	};

	$('#readyButton').fadeIn('fast');
};
Game.prototype.updateUserList = function(users) {
	$('#playerList').empty();
	for (var userId in users) {
		var userClass = '';
		var playerClass = 'class="player' + (Object.keys(users).indexOf(userId) + 1);
		if (userId === this.username) {
			playerClass = playerClass + ' user-self" title="This is you"';
		}
		$('#playerList').append('<li id="' + userId + '" ' + playerClass + '">' + 
		users[userId].username + '</li>');
	}
	if (timeout !== null) {
		clearTimeout(timeout);
	}
	$('#playerList').slideDown({queue: false});
};
Game.prototype.setupSocketListeners = function() {
	//update user list when people join or leave chat
	this.connection.on('updatebuddies', function(data) {
		if (!$('#gameContent').is(':visible')) {
			$('#gameContent').fadeIn('fast');
		}
		if (!$('#players').is(':visible')) {
			$('#players').fadeIn('fast');
		}

		this.numPlayers = Object.keys(data.users).length;
		this.updateUserList(data.users);
	}.bind(this));
	if (!$('#gameContent').is(':visible')) {
		$('#gameContent').fadeIn('fast');
	}
	if (!$('#players').is(':visible')) {
		$('#players').fadeIn('fast');
	}
	
	this.connection.on('logout', function(data) {
		this.numPlayers = Object.keys(data.users).length;
		this.updateUserList(data.users);
	}.bind(this));
	this.updateUserList({username: username});
}
Game.prototype.waitForPlayers = function() {
	$('#readyButton').click(function() {
		this.connection.emit('ready', {user: username, game: uniqueKey});
		var btn = $('#readyButton');
		btn.attr('disabled', 'disabled');
		btn.html('Ready!');
		btn.addClass('ready-waiting');
	}.bind(this));
	this.connection.on('startGame', function(data) {
		this.currentPlayer = data.currentPlayer;
		console.log('player ' + this.currentPlayer + ' starting game');
		$('#readyButton').hide();
		//instantiate game from game specific js
		var catan = new CatanGame(this);
		catan.startGame();

	}.bind(this));
}

if (typeof exports !== 'undefined') {
	exports.Game = Game;
}