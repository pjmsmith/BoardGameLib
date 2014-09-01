var Lobby = function() {
	this.lobbyId = uniqueKey;
};
Lobby.prototype = {
	constructor: Lobby,

	initialize: function() {
		this.displayError(errorMsg);
		this.renderChoices();
		this.setupSocketListeners();
	},

	displayError: function(errors) {
		if (typeof errors === 'object' && Object.keys(errors).length > 0) {
			var errorMsgs = '';
			for (var msg in errors) {
				errorMsgs += errors[msg] + '<br/>';
			}
			$('#error-msg').html(errorMsgs);
			$('#error').slideDown('fast');
		}
	},

	clearError: function() {
		$('#error-msg').html();
		$('#error').slideUp('fast');
	},

	renderChoices: function() {
		var self = this;
		if (!username) {
			console.log('no username');
			var playerName = $('#playerName');
			playerName.show();
			playerName.focus();
			playerName.keypress(function (e) {
				if (e.which == 13 || e.keyCode == 13) {
					username = playerName.val();
					if (username.length > 0) {
						self.clearError();

						playerName.empty();
						//join lobby as player
						if (!uniqueKey) {
							$.get( gameName + '/generateKey', function(data) {
								uniqueKey = data;
								window.history.pushState({}, document.title, window.location.href + '/lobby/' + uniqueKey); 
								socket.emit('login', {user: username, game: uniqueKey});
							});
						} else {
							socket.emit('login', {user: username, game: uniqueKey});
						}
					} else {
						self.displayError('Your name needs to be longer than that!<br/> Use at least one character.');
					}
				}
			}.bind(username));
		} else {
			//shouldn't happen until game data is stored in a cookie or session variable to allow reconnect
			console.log('good to go');
			var currentGame = new Game(gameName, username, playerNumber, uniqueKey, socket);
			console.log(currentGame.title);
			currentGame.setupSocketListeners();
			currentGame.waitForPlayers();
		}

		$('#newLobby').click(function() {
			$('#newLobby').fadeOut('fast');
			$('#lobbies').fadeOut('fast');
			$('.choice').slideUp('fast');
			$('#loginContainer').fadeIn('fast');
		});
	},
	
	setupSocketListeners: function() {
		var self = this;
		socket.on('loginSuccess', function(data) {
			self.clearError();
			$('#loginContainer').hide();
			$('#gameTitle').switchClass('title', 'title-small', 500);

			var playerNumber = data.playerNumber;
			self.createNewGame({
				 title: gameName
				,username: username
				,playerNumber: playerNumber
				,uniqueKey: uniqueKey
				,connection: socket
			});
		});
		socket.on('loginError', function(data) {
			if (data.error) {
				self.displayError();
			}
			$('#ready-button').fadeOut('fast');
		});
	},

	createNewGame: function(options) {
		var currentGame = new Game(options);
		Util.log('Loading game: ' + currentGame.title);
		currentGame.setupSocketListeners();
		currentGame.waitForPlayers();
	}
};
