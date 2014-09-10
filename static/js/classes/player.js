if (typeof require !== 'undefined') {
	var   env = require('jsdom').env
		, html = '<html></html>';
	var $;
	env(html, function (errors, window) {
		$ = require('jquery')(window);
	});
}
var Player = function(options) {
	this.options = {
		  id: null
		, name: ''
		, game: ''
		, playerNumber: -1
		, ready: false
		, hands: {} //hand type: array
		, pieces: {} //piece type: count
		, score: 0
		, state: null
	};
	this.options = $.extend(this.options, options);
	for (var key in this.options) {
		this[key] = this.options[key];
	}
	this.options = undefined;
	delete this.options;
};
Player.prototype = {
	constructor: Player,

	getHand: function (type) {
		return this.hands[type];
	},

	displayHand: function(type, sorted) {
		if (this.handDisplayed && this.handDisplayed !== type) {
			this.hideHand(this.handDisplayed);
		}
		if ($(this.game.element).length) {
			if (!$('#hand' + type).length) {
				this.game.element.append('<div id="hand' + type + '" class="hand" style="display:none"></div>');
			}
			var hand = $('#hand' + type);
			hand.empty();
			if (typeof this.hands[type] !== 'undefined') {
				if (sorted) {
					this.hands[type].sort();
				}
				for (var i = 0; i < this.hands[type].length; i++) {
					hand.append('<div class="card card-' + type + '-' + this.hands[type][i] + '"></div>');
					hand.css({'margin-left': '-' + (hand.outerWidth()/2) + 'px'})
				}
				this.handDisplayed = type;
				if (this.hands[type].length) {
					$('#hand' + type).fadeIn('fast');
				}
			}
		}
	},

	hideHand: function(type) {
		if (type) {
			$('#hand' + type).fadeOut('fast');
		}
		this.handDisplayed = null;
	},

	addCard: function(hand, card) {
		if (typeof this.hands[hand] === 'undefined') {
			this.hands[hand] = [];
		}
		this.hands[hand].push(card);
	},

	removeCard: function(hand, card) {
		if (typeof this.hands[hand] !== 'undefined') {
			var index = this.hands[hand].indexOf(card);
			if (index > -1) {
				this.hands[hand].splice(index, 1);
			} else {
				Util.log('Card does not exist!');
			}
		} else {
			Util.log('Hand does not exist!');
		}
	},

	addPiece: function(type) {
		if (typeof this.pieces[type] !== 'undefined') {
			this.pieces[type] += 1;
		} else {
			this.pieces[type] = 1;
		}
	},

	removePiece: function(type) {
		if (typeof this.pieces[type] !== 'undefined' && this.pieces[type] > 0) {
			this.pieces[type] -= 1;
		}
	},

	pieceCount: function(type) {
		var count = 0;
		if (typeof this.pieces[type] !== 'undefined') {
			count = this.pieces[type];
		} else {
			count = -1;
		}
		return count;
	}
};

if (typeof exports !== 'undefined') {
	exports.Player = Player;
}