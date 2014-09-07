
if (typeof require !== 'undefined') {
	var   env = require('jsdom').env
		, html = '<html></html>';
	var $;
	env(html, function (errors, window) {
		$ = require('jquery')(window);
	});
}
var Game = function(options) {
	this.options = {
		  title: ''
		, lobby: null
		, element: null
		, username: ''
		, playerNumber: 0
		, uniqueKey: null
		, connection: null
		, players: {}
		, board: null
		, pieces: null
		, decks: {
			//cards: [] - Resources, DevelopmentCards
		  }
		, state: null
		, activePlayer: 0
		, maxPlayers: 5
		, minPlayers: 2
		, numPlayers: 0
		, dice: {
			  number: 2
			, sides: 6
		  }
	};

	this.options = $.extend(this.options, options);
	for (var key in this.options) {
		this[key] = this.options[key];
	}
	this.options = undefined;
	delete this.options;
};
Game.prototype = {
	constructor: Game,

	/* Game Utility Functions */
	getNextPlayer: function(interval) {
		if (typeof interval === 'undefined') {
			interval = 1;
		}
		this.activePlayer = (this.activePlayer % this.maxPlayers) + interval;
		while (typeof this.players[this.activePlayer] === 'undefined') {
			this.activePlayer = (this.activePlayer % this.maxPlayers) + interval;
		}
		return this.activePlayer;
	},

	getAvailablePlayerNumber: function() {
		for (var i = 1; i <= this.maxPlayers; i++) {
			if (typeof this.players[i] === 'undefined') {
				return i;
			}
		}
		return null;
	},

	getPlayerByName: function(name) {
		for (var playerId in this.players) {
			if (this.players[playerId].name === name) {
				return this.players[playerId];
			}
		}
		return null;
	},

	getFirstPlayer: function() {
		var firstPlayer = null;
		if (Object.keys(this.players).length > 0) {
			firstPlayer = this.players[Object.keys(this.players)[0]].playerNumber;
		}
		return firstPlayer;
	},

	getLastPlayer: function() {
		var lastPlayer = null;
		if (Object.keys(this.players).length > 0) {
			lastPlayer = this.players[Object.keys(this.players)[Object.keys(this.players).length-1]].playerNumber;
		}
		return lastPlayer;
	},

	//TODO: Create a player list widget that this function can use so it isn't reconstructing it here
	updateUserList: function(users) {
		$('#playerList').empty();
		for (var userId in users) {
			var userClass = '';
			var user = users[userId];
			var playerClass = 'class="player' + (user.playerNumber);
			if (user.name === this.username) {
				playerClass = playerClass + ' user-self" title="This is you"';
			} else {
				playerClass += '"';
			}
			$('#playerList').append('<li id="' + user.name + '" ' + playerClass + '>' + 
			user.name + '</li>');
		}
		if (timeout !== null) {
			clearTimeout(timeout);
		}
		$('#playerList').slideDown({queue: false});
	},
	
	setupSocketListeners: function() {
		var self = this;
		//update user list when people join or leave game
		this.connection.on('updateplayers', function(data) {
			if (!$(self.element).is(':visible')) {
				$(self.element).fadeIn('fast');
			}
			if (!$('#players').is(':visible')) {
				$('#players').fadeIn('fast');
			}

			self.numPlayers = Object.keys(data.users).length;
			self.players = data.users;
			self.updateUserList(data.users);
		});
		if (!$(self.element).is(':visible')) {
			$(self.element).fadeIn('fast');
		}
		if (!$('#players').is(':visible')) {
			$('#players').fadeIn('fast');
		}
		
		this.connection.on('logout', function(data) {
			self.numPlayers = Object.keys(data.users).length;
			self.players = data.users;
			self.updateUserList(data.users);
		});
		this.updateUserList(this.players);
	},

	waitForPlayers: function() {
		var self = this;
		$('#readyButton').fadeIn('fast');
		var btn = $('#readyButton');
		btn.removeAttr('disabled');
		$('#readyButton').click(function() {
			self.connection.emit('ready', {user: {playerNumber: self.playerNumber}, game: uniqueKey});
			btn.html('Ready!');
			btn.addClass('ready-waiting');
		});
		this.connection.on('startGame', function(data) {
			self.players = data.users;
			self.initializePlayers();
			self.activePlayer = data.currentPlayer;
			self.updateUserList(self.players);
			Util.log('player ' + self.activePlayer + ' starting game');
			$('#readyButton').hide();

			//instantiate game from game specific js
			self.initialize();
			self.startGame(self.activePlayer);

		});
	},

	initializePlayers: function() {
		for (var player in this.players) {
			this.players[player].game = this;
			this.players[player] = new Player(this.players[player]);
		}
	},

	initialize: function() {
		//Child class must implement
	},

	startGame: function(firstPlayer) {
		//Child class must implement
	},

	startPlayerTurn: function() {
		//Child class must implement
	},

	endPlayerTurn: function() {
		//Child class must implement
	}
};

if (typeof exports !== 'undefined') {
	exports.Game = Game;
}