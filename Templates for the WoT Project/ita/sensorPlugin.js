//Troverete questo file seguendo il percorso './plugins/internal/' <---

//Troverete una breve descrizione di cosa fanno le righe di codice da modificare, seguita da un esempio basato sull'introduzione di un sensore PIR


//Dovrete rinominare questo file e ogni occorrenza di "SensorPlugin" con il nome del vostro sensore, seguito da "Plugin" <---
//Il nome del file stesso dovrebbe iniziare con una lettera minuscola. <---
///Esempio per il PIR plugin (infrarossi passivo)
///SensorPlugin diventa PirPlugin

var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var sensor, model;

var SensorPlugin = exports.SensorPlugin = function (params) {	///diventa: var PirPlugin = exports.PirPlugin = function (params) {
  CorePlugin.call(this, params, 'sensor', stop, simulate);	///diventa: CorePlugin.call(this, params, 'pir', stop, simulate);
  model = this.model;
  this.addValue(true);
};
util.inherits(SensorPlugin, CorePlugin);	///diventa: util.inherits(PirPlugin, CorePlugin);

function stop() {
  sensor.unexport();
};


//DOVRESTE modificare questa funzione per emulare il corretto funzionamento del vostro sensore <---
//qui ad esempio abbiamo un sensore booleano e lo emuliamo scegliando randomicamente un valore vero o falso con una probabilità del 50%
function simulate() {
	var random_boolean = Math.random() >= 0.5;
	this.addValue(random_boolean);
};

SensorPlugin.prototype.createValue = function (data){	///diventa: PirPlugin.prototype.createValue = function (data){
	//è molto importante che modifichiate il parametro "sensorValue" con il nome che avete scelto all'interno della rappresentazione JSON del modello (in piNoLd.json) <---
	///Ecco un esempio nel caso in cui abbiate chiamato la chiave del valore del vostro sensore "presence" all'interno del file piNoLd.json
  return {"sensorValue": data, "timestamp": utils.isoTimestamp()};	///diventa: return {"presence": data, "timestamp": utils.isoTimestamp()};
};

SensorPlugin.prototype.connectHardware = function () {	///diventa: PirPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  var self = this;
  sensor = new Gpio(self.model.values.presence.customFields.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);
    self.addValue(!!value);
    self.showValue();
	//Potete aggiungere del codice che verrà eseguito ogni qual volta viene rilevato un nuovo valore all'interno del sensore <---
	/**
	inserite qui il vostro codice addizionale...
	**/
  });
  console.info('Hardware %s sensor started!', self.model.name);
};






