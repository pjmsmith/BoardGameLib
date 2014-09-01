 var  fs = require('fs')
 	, utility = require(__dirname + '/../utility')
	, validFileTypePaths = {'js': '/js/games/', 'css': '/css/games/'};
var gameResources = {};
var log = utility.log;
var logObject = utility.logObject;

var loadGameResources = function(directory) {
	//load games
	fs.readdirSync(directory).forEach(function(filename) {
		if (fs.lstatSync(directory + '/' + filename).isDirectory()) {
			gameResources[filename] = {};
			for (var fileType in validFileTypePaths) {
				gameResources[filename][fileType] = loadFilesOfType(directory + '/../..' + validFileTypePaths[fileType] + filename, fileType);
			}
		}
	}.bind(gameResources));

};

var loadFilesOfType = function(directory, type, files) {
	files = files || [];
	if (typeof files === 'undefined') {
		files = [];
	}
	var allFiles = fs.readdirSync(directory);
	for(var i in allFiles){
		if (!allFiles.hasOwnProperty(i)) {
			continue;
		}
		var name = directory+'/'+allFiles[i];
		if (fs.statSync(name).isDirectory()){
			loadFilesOfType(name, type, files);
		} else {
			var name = name.substring((__dirname + '/../..').length, name.length);
			files.push(name);
		}
	}
	return files;
};

if (typeof exports !== 'undefined') {
	loadGameResources(__dirname);
	exports.gameResources = gameResources;
}