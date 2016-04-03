//bring in the connect module, which is in the node-modules folder
var connect = require('connect');
//bring in the serve-static module
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8000, function(){
	console.log('Listening on Port 8000...');

});