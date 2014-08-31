/* utility functions */
var timeout = null;

//server and client-side
var Color = {
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


var logObject = function logObject(o) {
  return JSON.stringify(o, null, 2);
}

var debug = true;

var log = function(msg) {
  if (debug) {
    console.log('-- Debug -- ' + msg);
  }
}

if (typeof exports !== 'undefined') {
  exports.Color = Color;
  exports.log = log;
  exports.logObject = logObject;
}
