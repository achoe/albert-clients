var events = require('./albert-client');
var e = new events.EventEmitter("http://127.0.0.1:30301");
e.emit("yoloswaggins", "OK", 100, { feggitmaster: "1337" }, function(data) {
});
e.once("DERP", function(json) {
	console.log("yah awrite mate?");
});