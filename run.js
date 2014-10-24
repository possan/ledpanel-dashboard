var fs = require('fs');

var Mixer = require('./lib/mixer').Mixer;
var Adapter = require('./lib/adapter').Adapter;

var adapter = new Adapter();
var mixer = new Mixer();

var files = fs.readdirSync('screens');
files.forEach(function(filename) {
	var nam = filename.replace(/\.js/g, '');
	console.log('found screen: ' + nam);
	var scr = require('./screens/' + nam);
	if (scr && scr.Screen) {
		console.log('adding screen: ' + nam);
		mixer.addProvider(new scr.Screen());
	}
});

adapter.findSerial(function(port) {
	if (port) adapter.connectSerial(port);
});

mixer.start(adapter);
