var resources = require('../static/js/games/resources');
module.exports = function(server) {
	server.get('/', function(req, res){
		res.render('library.jade', {
			locals: {
				 games: Object.keys(resources.gameResources)
				,title : 'Board Game Library'
				,description: 'Board Game Library'
				,author: 'Patrick Smith'
				,analyticssiteid: 'XXXXXXX' 
			}
		});
	});
	//A Route for Creating a 500 Error (Useful to keep around)
	server.get('/500', function(req, res){
		throw new Error('This is a 500 Error');
	});

	//The 404 Route (ALWAYS Keep this as the last route)
	server.get('/*', function(req, res){
		throw new NotFound;
	});
};
