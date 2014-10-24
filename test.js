var fs = require('fs');

var requested_screen = (process.argv.length > 2) ? process.argv[2] : '';
// console.log('requested_screen', requested_screen);

var Mixer = require('./lib/mixer').Mixer;
var Adapter = require('./lib/adapter').Adapter;

var adapter = new Adapter();
var mixer = new Mixer();

var files = fs.readdirSync('screens');
files.forEach(function(filename) {
	var nam = filename.replace(/\.js/g, '');
	console.log('found screen: ' + nam);
	if (requested_screen == '' || requested_screen == nam) {
		var scr = require('./screens/' + nam);
		if (scr && scr.Screen) {
			console.log('adding screen: ' + nam);
			mixer.addProvider(new scr.Screen());
		}
	}
});

adapter.findSerial(function(port) {
	if (port) adapter.connectSerial(port);
});

mixer.start(adapter);
