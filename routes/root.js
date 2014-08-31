module.exports = function(server) {

    //A Route for Creating a 500 Error (Useful to keep around)
    server.get('/500', function(req, res){
        throw new Error('This is a 500 Error');
    });

    //The 404 Route (ALWAYS Keep this as the last route)
    server.get('/*', function(req, res){
        throw new NotFound;
    });
};
