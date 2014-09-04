var Lobby = function(uniqueKey, container) {
	this.element = container;
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
			if (!$('#error').is(':visible')) {
				$('#error').slideDown('fast');
			}
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
							$.get('/' + gameName + '/generateKey', function(data) {
								uniqueKey = data;
								var location = window.location.href;
								window.history.pushState({}, document.title, location + (location.charAt(location.length-1) == '/' ? '' : '/') + 'lobby/' + uniqueKey); 
								socket.emit('login', {user: username, game: uniqueKey});
							});
						} else {
							socket.emit('login', {user: username, game: uniqueKey});
						}
					} else {
						self.displayError({error: 'Your name needs to be longer than that!<br/> Use at least one character.'});
					}
				}
			}.bind(username));
		} else {
			//shouldn't happen until game data is stored in a cookie or session variable to allow reconnect
			console.log('good to go');
			self.createNewGame({
				 title: gameName
				,username: username
				,playerNumber: playerNumber
				,uniqueKey: uniqueKey
				,connection: socket
			});
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
			self.createNewGame(gameName, {
				 title: gameName
				,element: self.element
				,username: username
				,playerNumber: playerNumber
				,uniqueKey: uniqueKey
				,connection: socket
			});
		});
		socket.on('loginError', function(data) {
			if (data.error) {
				self.displayError(data);
			}
			$('#ready-button').fadeOut('fast');
		});
	},

	createNewGame: function(gameName, options) {
		if (typeof Game[gameName] !== 'undefined') {
			var currentGame = new Game[gameName](options);
			Util.log('Loading game: ' + currentGame.title);
			currentGame.setupSocketListeners();
			currentGame.waitForPlayers();
		}
	}
};
