var Game = Game || {};

/* Game Configuration and Constants */
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
var DeckType = {
	 RESOURCE: 1
	,DEVELOPMENT: 2
};
var CardType = {
	 KNIGHT: 1
	,VICTORY_POINT: 2
	,MONOPOLY: 3
	,ROAD_BUILDING: 4
	,YEAR_OF_PLENTY: 5
};
var ResourceType = {
	 SHEEP: 1
	,WOOD: 2
	,BRICK: 3
	,WHEAT: 4
	,ORE: 5
};
var CardLimits = {};
CardLimits[CardType.KNIGHT] = 14;
CardLimits[CardType.VICTORY_POINT] = 5;
CardLimits[CardType.MONOPOLY] = 2;
CardLimits[CardType.ROAD_BUILDING] = 2;
CardLimits[CardType.YEAR_OF_PLENTY] = 2;

var RESOURCE_LIMIT = 19;

var PieceType = {
	 ROAD: 1
	,SETTLEMENT: 2
	,CITY: 3
};

var PieceLimits = {};
PieceLimits[PieceType.ROAD] = 15;
PieceLimits[PieceType.SETTLEMENT] = 5;
PieceLimits[PieceType.CITY] = 4;

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
				for (var type in DeckType) {
					this.populateDeckByType(DeckType[type]);
				}

				//set up pieces
				this.players[this.playerNumber].pieces = this.getPieces(this.playerNumber);

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

		startGame: function(firstPlayer) {
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

		},

		/* Game specific utility functions */

		populateDeckByType: function(type) {
			switch (type) {
				case DeckType.RESOURCE:
					this.decks[type] = this.getResourceCards();
					break;
				case DeckType.DEVELOPMENT:
					this.decks[type] = this.getDevelopmentCards(true);
					break;
				default:
					console.log('Unknown deck type');
					break;
			}
		},

		getPieces: function(player) {
			var pieces = {};
			if (typeof this.players[player] !== 'undefined') {
				if (this.players[player].pieces === 'undefined') {
					for (var type in PieceType) {
						pieces[PieceType[type]] = PieceLimits[type];
					}
					this.players[player].pieces = pieces;
				}
				
				pieces = this.players[player].pieces;
			} 
			return pieces;
		},

		getResourceCards: function() {
			if (typeof this.decks[DeckType.RESOURCE] === 'undefined') {
				var resourceCards = {};
				for (var type in ResourceType) {
					resourceCards[ResourceType[type]] = RESOURCE_LIMIT;
				}
				this.decks[DeckType.RESOURCE] = resourceCards
			}
			return this.decks[DeckType.RESOURCE];
		},

		getDevelopmentCards: function(shuffle) {
			if (typeof this.decks[DeckType.DEVELOPMENT] === 'undefined') {
				var devCards = [];
				for (var type in CardType) {
					for (var i = 0; i < CardLimits[CardType[type]]; i++) {
						devCards.push(CardType[type]);
					}
				}

				this.decks[DeckType.DEVELOPMENT] = devCards;
			}
			if (shuffle) {
				this.decks[DeckType.DEVELOPMENT] = Util.shuffle(this.decks[DeckType.DEVELOPMENT]);
			}
			return this.decks[DeckType.DEVELOPMENT]
		}
	});
};