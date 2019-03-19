//YOU will find this file inside the ROOT fodler of the project <---

//You will find a brief description of the lines of code that you'll need to change, followed by an example based on the introduction of a PIR sensor

///Don't mind the stuff from here... <---
var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  fs = require('fs');


var createServer = function (port, secure) {
  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = resources.customFields.port;
  if (secure === undefined) secure = resources.customFields.secure;

  initPlugins();

  if(secure) {
    var https = require('https');
    var certFile = './resources/caCert.pem';
    var keyFile = './resources/privateKey.pem';
    var passphrase = 'webofthings';

    var config = {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      passphrase: passphrase
    };

    return server = https.createServer(config, restApp)
      .listen(port, function () {
        wsServer.listen(server);
        console.log('Secure WoT server started on port %s', port);
    })
  } else {
    var http = require('http');
    return server = http.createServer(restApp)
      .listen(process.env.PORT || port, function () {
        wsServer.listen(server);
        console.log('Insecure WoT server started on port %s', port);
    })
  }
};
///...to here <---

////---------------------------EDIT THIS SECTION---------------------------
//YOU ONLY NEED TO CHANGE SOME THINGS HERE and inside process.on() <---
function initPlugins() {
	//import the plugin, X is the name of the plugin file
	var X = require('./plugins/internal/X').X;	///becomes: var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
	
	//declaration and initialization of the plugin
	X = new X({'simulate' : false, 'frequency' : 5000});	///becomes: pirPlugin = new PirPlugin({'simulate': false, 'frequency': 5000});
	//you can set simulate to true if the plugin is not physically connected but only a virtual representation
	//the frequency represents how often (in ms) the plugin simulates it's value
	
	//starting the plugin
	X.start();	///becomes: pirPlugin.start();
	
	//Here we'll show the other plugins
	var LockPlugin = require('./plugins/internal/lockPlugin').LockPlugin;
	var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;
	
	lockPlugin = new LockPlugin({'simulate': true, 'frequency': 5000});
	lockPlugin.start();

	dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 5000});
	dht22Plugin.start();
}

module.exports = createServer;

//YOU ONLY NEED TO CHANGE SOME THINGS HERE and inside initPlugins() <---
process.on('SIGINT', function () {
	//stopping the plugin
	X.stop();	///becomes: pirPlugin.stop();
	
	//Here we'll show the other plugins
	lockPlugin.stop();
	dht22Plugin.stop();
	
  console.log('------TERMINATED------');	//You can edit this message to display what you want when the program is closed
  process.exit();
});

//-------------------------------------------------------------------------