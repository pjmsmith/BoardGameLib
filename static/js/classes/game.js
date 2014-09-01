
var Game = function(options) {
	this.options = {
		  title: ''
		, username: ''
		, playerNumber: 0
		, uniqueKey: ''
		, connection: null
		, players: {
			  ready: false
			, cards: []
			, pieces: []
			, state: null
		  }
		, currentPlayer: null
		, board: null
		, decks: {
			//cards: []
		  }
		, state: null
		, activePlayer: null
		, maxPlayers: 5
		, minPlayers: 2
		, numPlayers: 1
		, dice: {
			  number: 2
			, sides: 6
		  }
	};

	this.options = $.extend(this.options, options);
	for (var key in this.options) {
		this[key] = this.options[key];
	}
};
Game.prototype = {
	constructor: Game,

	updateUserList: function(users) {
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
			self.updateUserList(data.users);
		});
		this.updateUserList({username: username});
	},

	waitForPlayers: function() {
		var self = this;
		$('#readyButton').fadeIn('fast');
		$('#readyButton').click(function() {
			self.connection.emit('ready', {user: username, game: uniqueKey});
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
	}
};

if (typeof exports !== 'undefined') {
	exports.Game = Game;
}