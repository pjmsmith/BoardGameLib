var Game = Game || {};

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
			if ($(this.element)) {
				this.board = new GameBoard({
					 element: this.element
					,game: this
				});
				this.board.render();

			} else {
				console.log('Game container element does not exist!')
			}
		},

		startGame: function(firstPlayer){
			this.activePlayer = firstPlayer;

			$('.player' + this.activePlayer).addClass('player-turn');
			if (this.activePlayer === this.playerNumber) {
				console.log('player ' + this.activePlayer + ' starting turn')
				this.startPlayerTurn();
			} else {
				//this.disableBuildControls();
			}
		},

		startPlayerTurn: function() {

		},

		endPlayerTurn: function() {

		}
	});
};