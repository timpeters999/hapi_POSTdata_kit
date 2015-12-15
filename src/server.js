var hapi = require('hapi');

//force the working directory to be this one 
process.chdir(__dirname);

// Create hapi server instance
var server = new hapi.Server();

// add connection parameters
server.connection({
    port: 1400
});

//https://www.npmjs.com/package/vision
server.register(require('vision'), function (err) {
    if (err) {
        console.log("Failed to load vision.");
    }
	
	server.views({
		engines:{
			html: require('handlebars')
		},
		path: './views',  // my views live here
        layoutPath: 'views/layout',  // my layouts live here.  for this kit, I will only use one
        layout: 'default',  // my default layout is 'default'
        partialsPath: 'views/partials'    // my partial views live in this directory
	})
});

//you can use hapi without this:  https://www.npmjs.com/package/inert
server.register(require('inert'), function (err) {
    if (err) {
        throw err;
    }
	server.route(require('./lib/routes/routes'));

	server.start(function(){
		console.log('listening on ' + server.info.uri);
	});
});