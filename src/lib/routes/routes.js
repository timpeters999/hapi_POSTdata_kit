
var handlers = require('./handlers');

var routes = [
    {
		path: '/{path*}',
		method: 'GET',
		handler: {
			directory: {
				path: './lib/public',
				listing: false
			}
		}
	},
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            //this is what i want to do for my home page:  render my index.html page and pass in some data to it
            var data = {
                title: 'POST data using Hapi/Angular',
                message: 'This will simply POST data and return a response'
            };

            return reply.view('index', data);
        }
    },
    {
        method: 'POST',
        path: '/postto',
        handler: function(request, reply){
				handlers.postto(request,reply);
			}
        
    }
];

//let's make the routes available to the server
module.exports = routes;