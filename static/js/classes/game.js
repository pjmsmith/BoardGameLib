
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
		, element: null
		, username: ''
		, playerNumber: 0
		, uniqueKey: null
		, connection: null
		, players: {}
		, currentPlayer: null
		, board: null
		, decks: {
			//cards: []
		  }
		, state: null
		, activePlayer: null
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

	getNextPlayer: function() {
		return (this.activePlayer % this.numPlayers) + 1;
	},

	getAvailablePlayerNumber: function() {
		for (var i = 1; i <= this.maxPlayers; i++) {
			if (typeof this.players[i] === 'undefined') {
				return i;
			}
		}
		return null;
	},

	updateUserList: function(users) {
		$('#playerList').empty();
		for (var userId in users) {
			var userClass = '';
			var user = users[userId];
			var playerClass = 'class="player' + (user.playerNumber);
			if (userId === this.username) {
				playerClass = playerClass + ' user-self" title="This is you"';
			}
			$('#playerList').append('<li id="' + userId + '" ' + playerClass + '">' + 
			user.name + '</li>');
		}
		if (timeout !== null) {
			clearTimeout(timeout);
		}
		$('#playerList').slideDown({queue: false});
	},
	
	setupSocketListeners: function() {
		var self = this;
		//update user list when people join or leave chat
		this.connection.on('updatebuddies', function(data) {
			if (!$('#gameContent').is(':visible')) {
				$('#gameContent').fadeIn('fast');
			}
			if (!$('#players').is(':visible')) {
				$('#players').fadeIn('fast');
			}

			self.numPlayers = Object.keys(data.users).length;
			self.players = data.users;
			self.updateUserList(data.users);
		});
		if (!$('#gameContent').is(':visible')) {
			$('#gameContent').fadeIn('fast');
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
		$('#readyButton').click(function() {
			self.connection.emit('ready', {user: {playerNumber: self.playerNumber}, game: uniqueKey});
			var btn = $('#readyButton');
			btn.attr('disabled', 'disabled');
			btn.html('Ready!');
			btn.addClass('ready-waiting');
		});
		this.connection.on('startGame', function(data) {
			self.currentPlayer = data.currentPlayer;
			Util.log('player ' + self.currentPlayer + ' starting game');
			$('#readyButton').hide();

			//instantiate game from game specific js

			var catan = new CatanGame(self);
			catan.startGame();

		});
	},

	render: function() {

	}
};

if (typeof exports !== 'undefined') {
	exports.Game = Game;
}