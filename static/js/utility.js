/* utility functions */
var timeout = null;
var debug = true;

var Util = {};

Util.mobileCheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check; 
}

//server and client-side
Util.Color = {
	defaults: {
		// Predefined hex codes that cant be used as random colors
		// All must be prefixed with the '#' indicator
		predef: [],

		// Maximum & Minimum random range values
		rangeMax: 255,
		rangeMin: 0,

		// Upper and lower level values that must be 
		// passed for random color acceptance
		//
		// By setting levelUp: 200, levelDown: 100; Neutral
		// colors like White, Gray, and Black can be somewhat weeded
		// out and your random colors will be full spectrum based.
		// Note*: Doing so increases likely hood of recursion
		levelUp: -1,
		levelDown: 256,

		// Recursion handlers
		recursionLimit: 15,
		recursion: function(){
			throw 'Recursion Error in Random Color Generator, ' +
				'too many tries on finding random color, ' +
				'[Limit ' + this.recursionLimit + ']';
		}
	},

	// Caching of random colors
	stack: {},

	// Returns a random color in hex code form, and caches
	// find in the stack.
	random: function(i){
		var self = this,
			defaults = self.defaults,
			r = self.rand(),
			g = self.rand(),
			b = self.rand(),
			hex = self.rgb2hex(r, g, b),
			levels = true;

		// Check for recursion
		if (i === undefined || typeof i !== 'number') i = 0;
		else if (i++ > defaults.recursionLimit) return defaults.recursion();

		// Color already used, try another one
		if (self.stack[hex]) hex = self.random(i);

		// Ensure one of the vals is above levelUp and another is below levelDown
		// Check defaults comments for better understanding
		levels = !!(
			(r > defaults.levelUp || g > defaults.levelUp || b > defaults.levelUp) &&
			(r < defaults.levelDown || g < defaults.levelDown || b < defaults.levelDown)
		);
		if (! levels) hex = self.random(i);

		// Store on stack to help prevent repeat
		self.stack[hex] = [r,g,b];

		// Return hex code in #
		return hex;
	},

	// Returns random number within range
	rand: function(){
		var defaults = this.defaults;
		return defaults.rangeMin + Math.floor(Math.random()*(defaults.rangeMax+1));
	},

	// Clears the stack
	reset: function(){
		var self = this,
			predef = self.defaults.predef,
			i = -1, l = predef.length;
		self.stack = {};
		if (l > 0)
			for ( ; ++i < l; )
				self.stack[ predef[i] ] = true;
	},

	// Returns hex code
	rgb2hex: function(r, g, b){
		var str = '0123456789ABCDEF';
		return '#' + [
			str.charAt((r-r%16)/16) + str.charAt(r%16),
			str.charAt((g-g%16)/16) + str.charAt(g%16),
			str.charAt((b-b%16)/16) + str.charAt(b%16)
		].join('');
	},

	// Returns in array form [red, green, blue]
	hex2rgb: function(hex){
		if (hex.substr(0, 1) === '#')
			hex = hex.substr(1);

		// Use the stack if possible to reduce processing
		return this.stack['#'+hex] ? this.stack['#'+hex] : 
			hex.length === 6 ? [
				parseInt(hex.substr(0, 2), 16),
				parseInt(hex.substr(2, 2), 16),
				parseInt(hex.substr(4, 2), 16)
			] : hex.length === 3 ? [
				parseInt(hex.substr(0, 1), 16),
				parseInt(hex.substr(1, 1), 16),
				parseInt(hex.substr(2, 1), 16)
			] : [];
	}
};

Util.shuffle = function(arr) {
	var currentIndex = arr.length, temp, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -=1;
		temp = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temp;
	}
	return arr;
};

Util.logObject = function logObject(o) {
	return JSON.stringify(o, null, 2);
};

Util.log = function(msg) {
	if (debug) {
		console.log('-- Debug -- ' + msg);
	} 
};

if (typeof exports !== 'undefined') {
	exports.Color = Util.Color;
	exports.log = Util.log;
	exports.logObject = Util.logObject;
	exports.shuffle = Util.shuffle;
	exports.debug = debug;
}
