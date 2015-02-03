var Game = Game || {};
var GameState = {
	 WAITING_FOR_PLAYERS: 1
	,STARTED: 2
	,FINISHED: 3
	,MOVING_ROBBER: 4
	,TRADING: 5
	,BUILDING: 6
	,PLAYING_DEV_CARD: 7
	,IDLE: 8
	,FIRST_ROUND: 9
};
Game.Catan = function(options) {
	//Reference for available Game options
	/*this.options = {
		  title: ''
		, element: null
		, username: ''
		, playerNumber: 0
		, uniqueKey: null
		, connection: null
		, players: {}

		, state: null
		, activePlayer: 0
		, maxPlayers: 5
		, minPlayers: 2
		, numPlayers: 0

		, board: null
		, pieces: null
		, decks: {
			//cards: [] - Resources, DevelopmentCards
		  }
		, dice: {
			  number: 2
			, sides: 6
		  }
	};*/
	//Inherit from base Game class
	$.extend(this, new Game(options));
	$.extend(this, {
		initialize: function() {
			if (this.lobby && typeof this.lobby.clearError === 'function') {
				this.lobby.clearError();
			}
			if ($(this.element)) {
				//set up cards

				//

				this.board = new GameBoard({
					 element: this.element
					,game: this
				});
				this.board.render();
				this.state = GameState.STARTED;
			} else {
				console.log('Game container element does not exist!')
			}
		},

		startGame: function(firstPlayer){
			this.activePlayer = firstPlayer;
			if (this.state === GameState.STARTED) {
				this.state = GameState.FIRST_ROUND;
			}	
			$('.player' + this.activePlayer).addClass('player-turn');
			if (this.activePlayer === this.playerNumber) {
				console.log('player ' + this.activePlayer + ' starting turn');
				this.startPlayerTurn();
			} else {
				this.board.disableBuildControls();
			}
		},

		startPlayerTurn: function() {
			this.board.startPlayerTurn();
		},

		endPlayerTurn: function() {

		}
	});
};