//This file should be located here: './plugins/internal/' <---

//You will find a brief description of the lines of code that you'll need to change, followed by an example based on the introduction of a PIR sensor

//You'll need to rename this file and every occurence of "SensorPlugin" with the name of your sensor, followed by Plugin <---
//The name of the file itself should start with a lower case letter. <---
///Exapmles for a Pir plugin (passive infra-red)
///SensorPlugin becomes PirPlugin

var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var sensor, model;

var SensorPlugin = exports.SensorPlugin = function (params) {	///becomes: var PirPlugin = exports.PirPlugin = function (params) {
  CorePlugin.call(this, params, 'sensor', stop, simulate);	///becomes: CorePlugin.call(this, params, 'pir', stop, simulate);
  model = this.model;
  this.addValue(true);
};
util.inherits(SensorPlugin, CorePlugin);	///becomes: util.inherits(PirPlugin, CorePlugin);

function stop() {
  sensor.unexport();
};

//You should edit this function to emulate the correct behaviour of your sensor <---
//here we have a boolean sensor and we emulate it by choosing randomly is value with a 50-50 chance
function simulate() {
	var random_boolean = Math.random() >= 0.5;
	this.addValue(random_boolean);
};

SensorPlugin.prototype.createValue = function (data){	///becomes: PirPlugin.prototype.createValue = function (data){
	//It's very important that you change the parameter "sensorValue" with the name you gave it inside the JSON model representation! <---
	///Here's an example if you choose to name the key of the value of your sensor inside piNoLd.json "presence"
  return {"sensorValue": data, "timestamp": utils.isoTimestamp()};	///becomes: return {"presence": data, "timestamp": utils.isoTimestamp()};
};

SensorPlugin.prototype.connectHardware = function () {	///becomes: PirPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  var self = this;
  sensor = new Gpio(self.model.values.presence.customFields.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);
    self.addValue(!!value);
    self.showValue();
	//You can add here additional code that will be executed whenever the plugin detects a change of value in your sensor <---
	/**
	insert your additional code here...
	**/
  });
  console.info('Hardware %s sensor started!', self.model.name);
};






