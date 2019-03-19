//Troverete questo file all'interno della ROOT del progetto <---

//Troverete una breve descrizione di cosa fanno le righe di codice da modificare, seguita da un esempio basato sull'introduzione di un sensore PIR

///Ignorate il codice da qui... <---
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
///... a qui <---

////---------------------------SEZIONE DA MODIFICARE---------------------------
//DOVRETE MODIFICARE DEL CODICE SOLO ALL'INTERNO DI QUESTA FUNZIONE e di process.on() <---
function initPlugins() {
	//importaimo il plugin, X è il nome del file plugin
	var X = require('./plugins/internal/X').X;	///diventa: var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
	
	//dichiariamo ed inizializziamo il plugin
	X = new X({'simulate' : false, 'frequency' : 5000});	///diventa: pirPlugin = new PirPlugin({'simulate': false, 'frequency': 5000});
	//potete settare il parametro simulate a true se non avete connesso fisicamente un sensore al RPi
	//il parametro 'frequency' rappresenta la frequenza in ms con cui il plugin simula il suo valore
	
	//eseguiamo il plugin
	X.start();	///diventa: pirPlugin.start();
	
	//Mostriamo il medesimo processo per gli altri plugin
	var LockPlugin = require('./plugins/internal/lockPlugin').LockPlugin;
	var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;
	
	lockPlugin = new LockPlugin({'simulate': true, 'frequency': 5000});
	lockPlugin.start();

	dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 5000});
	dht22Plugin.start();
}

module.exports = createServer;

//DOVRETE MODIFICARE DEL CODICE SOLO ALL'INTERNO DI QUESTA FUNZIONE e di initPlugins() <---
process.on('SIGINT', function () {
	//interrompiamo il plugin
	X.stop();	///diventa: pirPlugin.stop();
	
	//Mostriamo il medesimo processo per gli altri plugin
	lockPlugin.stop();
	dht22Plugin.stop();
	
  console.log('------TERMINATED------');	//Potete modificare il messaggio che verrà mostrato quando il programma viene interrotto
  process.exit();
});

//-------------------------------------------------------------------------