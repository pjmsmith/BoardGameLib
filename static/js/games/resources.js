 var jsPath = '/js/games/';
 var cssPath = '/css/games/';
 var gameResources = {
	'Catan': {
       'js' : [
       			 jsPath + 'Catan/gameboard.js'
       			,jsPath + 'Catan/catan.js'
       		]
      ,'css': [
      			 cssPath + 'Catan/gameboard.css'
      			,cssPath + 'Catan/interface.css'
      		]
  	}
};
/*
var fs = require('fs'),
	validFileTypes = ['js'];

var requireFiles = function(directory, app) {
	fs.readdirSync(directory).forEach(function(filename) {
		if (fs.lstatSync(directory + '/' + filename).isDirectory()) {
			requireFiles(directory + '/' + filename, app);
		} else {
			if (filename === 'resources.js' && directory === __dirname) return;

			if (validFileTypes.indexOf(filename.split('.').pop()) === -1) return;
			console.log(directory + '/' + filename);
			require(directory + '/' + filename)(app);
		}
	});

};*/

if (typeof exports !== 'undefined') {
	exports.gameResources = gameResources
}