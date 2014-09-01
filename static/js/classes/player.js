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
		, number: -1
	  	, ready: false
		, hands: {}
		, pieces: {}
		, state: null
	};
	this.options = $.extend(this.options, options);
	for (var key in this.options) {
		this[key] = this.options[key];
	}
};
Player.prototype = {
	constructor: Player,

	getHand: function (type) {
		return this.hands[type];
	},

	displayHand: function(type) {

	},

	hideHand: function(type) {

	},

	addPiece: function(type) {
		if (typeof pieces[type] !== 'undefined') {
			pieces[type] += 1;
		} else {
			pieces[type] = 1;
		}
	},

	removePiece: function(type) {
		if (typeof pieces[type] !== 'undefined' && pieces[type] > 0) {
			pieces[type] -= 1;
		}
	},

	pieceCount: function(type) {
		var count = 0;
		if (typeof pieces[type] !== 'undefined') {
			count = pieces[type];
		} else {
			count = -1;
		}
		return count;
	}
};

if (typeof exports !== 'undefined') {
	exports.Player = Player;
}