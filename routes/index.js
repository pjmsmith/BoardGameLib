var fs = require('fs'),
	validFileTypes = ['js'];

var requireFiles = function(directory, app) {
	fs.readdirSync(directory).forEach(function(filename) {
		if (fs.lstatSync(directory + '/' + filename).isDirectory()) {
			requireFiles(directory + '/' + filename, app);
		} else {
			if (filename === 'index.js' && directory === __dirname) return;

			if (validFileTypes.indexOf(filename.split('.').pop()) === -1) return;
			require(directory + '/' + filename)(app);
		}
	});

};

module.exports = function(app) {
	requireFiles(__dirname, app);
}