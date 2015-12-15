(function(){

'use strict'
	
	var handlers = {};
        
    handlers.postto =  function(request, reply){
        
        reply(request.payload.username + " " + request.payload.password);
    };
      
    module.exports = handlers;
    
})();