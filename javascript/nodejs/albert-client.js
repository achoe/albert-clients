var request = require('request')
, o = require('fnoverload');
function aee(albert) {
	this.albertServer = albert;
	this.events = {};
}
aee.prototype.on = aee.prototype.addListener = function(event, fn) {
	var $aee = this; 
	if(!(event in this.events)) {
		var r = request(this.albertServer + "/listen/" + event + "/", { timeout: 0})
		.once("data", function(data) {
			var d = data.toString().trim();
			if(d.substring(0, 2) == "{\"") {
				r.on("data", function(rawEvent) {
					var raw = rawEvent.toString().trim();
					if(raw.substring(0, 2) == "{\"") {
						var json = JSON.parse(raw);
						for(var e in $aee.events[event].listeners) {
							$aee.events[event].listeners[e](json);
						}
					}
				})
				.on("end", function() {
					if(event in $aee.events) {
						delete $aee.events[event];
					}
				});
			}
		});
		this.events[event] = { listeners: [], request: r };
	}
	this.events[event].listeners.push(fn);
	return this;
}
aee.prototype.once = function(event, fn) {
	var $aee = this; 
	if(!(event in this.events)) {
		var r = request(this.albertServer + "/listen/" + event + "/", { timeout: 0})
		.once("data", function(data) {
			var d = data.toString().trim();
			if(d.substring(0, 2) == "{\"") {
				r.on("data", function(rawEvent) {
					var raw = rawEvent.toString().trim();
					if(raw.substring(0, 2) == "{\"") {
						var json = JSON.parse(raw);
						for(var e in $aee.events[event].listeners) {
							$aee.events[event].listeners[e](json);
						}
					}
				})
				.on("end", function() {
					if(event in $aee.events) {
						delete $aee.events[event];
					}
				});
			}
		});
		this.events[event] = { listeners: [], request: r };
	}
	var fnOnce = function() {
		fn.apply(this, arguments);
		$aee.removeListener(event, fnOnce);
	};
	this.events[event].listeners.push(fnOnce);
	return this;
}
aee.prototype.emit = o(
	  function(event, fn) { return this.emit(event, "OK", 100, null, fn); }
	  
	  
	, function(event, status, fn) { return this.emit(event, status, 100, null, fn); }
	
	
	, function(event, status, progress, fn) { return this.emit(event, status, progress, null, fn); }
	
	
	, function(event, status, progress, data, fn) {
		request.post(this.albertServer + "/emit/" + event, {
			body:  JSON.stringify({status: status, progress: progress, data: data}), json: true
		}, function(err, res, body) {
			fn(err, body);
		});
		return this;
	}
);
aee.prototype.update = o(
	   function(event) { return this.update(event, "OK", 100, null); }
	   
	,  function(event, fn) { return this.update(event, "OK", 100, null, fn); }
	  
	  
	, function(event, status, fn) { return this.update(event, status, 100, null, fn); }
	
	
	, function(event, status, progress, fn) { return this.update(event, status, progress, null, fn); }
	
	
	, function(event, status, progress, data, fn) {
		request.post(this.albertServer + "/update/" + event, {
			body:  JSON.stringify({status: status, progress: progress, data: data}), json: true
		}, function(err, res, body) {
			fn && fn(err, body);
		});
		return this;
	}
);
aee.prototype.removeListener = function(event, fn) {
	if(event in this.events) {
		var i = this.events[event].listeners.indexOf(fn);
		if(i !== -1) {
			this.events[event].listeners.splice(i, 1);
		}
		if(this.events[event].listeners.length === 0) {
			this.removeAllListeners(event);
		}
	}
	return this;
}
aee.prototype.removeAllListeners = o(
	  function() {
		for(i in this.events) {
			this.events[i].request.abort();
		}
		return this;
	  }
	, function(event) {
		if(event in this.events) {
			this.events[event].request.abort();
			delete this.events[event];
		}
		return this;
	  }
);  
exports.EventEmitter = aee;