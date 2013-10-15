var Rhospection = new function() {
	this.models = new Object();
	this.controllers = new Object();
	
	
	this.contentResponseHandler = function(responseText) {
      $("#content").html(responseText);
	};
	this.contentCall = function(resource, handler) {
	          
		$.get(  
           resource,  
           null,  
           Rhospection.contentResponseHandler,  
           "html"  
		).done(handler);
	};
	this.listRows = 5;
	
};
alert('rhospection is loaded');