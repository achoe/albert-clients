var request = require('request')
, o = require('fnoverload');
function aee(albert) {
	this.albertServer = albert;
	this.handlers = [];
}
aee.prototype.on = aee.prototype.addListener = function(event, fn) {
	var $aee = this
	, r = request(this.albertServer + "/listen/" + event + "/",  { timeout: 0})
	.once("data", function(data) {
		var d = data.toString().trim();
		if(d.substring(0, 2) == "{\"") {
			r.on("data", function(rawEvent) {
				var raw = rawEvent.toString().trim();
				if(raw.substring(0, 2) == "{\"") {
					var json = JSON.parse(raw);
					fn(json);
				}
			})
			.on("end", function() {
				for(i in $aee.handlers) {
					if($aee.handlers[i].key.e == event && $aee.handlers[i].key.fn == fn) {
						$aee.handlers.splice(i, 1);
					}
				}
			});
		}
	});
	this.handlers.push({ key: { e: event, fn: fn }, request: r });
	return this;
}
aee.prototype.once = function(event, fn) {
	var $aee = this
	, r = request(this.albertServer + "/listen/" + event + "/", { timeout: 0})
	.once("data", function(data) {
		var d = data.toString().trim();
		if(d.substring(0, 2) == "{\"") {
			r.once("data", function(rawEvent) {
				var raw = rawEvent.toString().trim();
				if(raw.substring(0, 2) == "{\"") {
					var json = JSON.parse(raw);
					fn(json);
				}
			})
			.on("end", function() {
				for(i in $aee.handlers) {
					if($aee.handlers[i].key.e == event && $aee.handlers[i].key.fn == fn) {
						$aee.handlers.splice(i, 1);
					}
				}
			});
		}
	});
	this.handlers.push({ key: { e: event, fn: fn }, request: r });
}
aee.prototype.emit = o([
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
]);
aee.prototype.update = o([
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
]);
aee.prototype.removeListener = function(event, fn) {
	for(i in this.handlers) {
		if(this.handlers[i].key.e == event && this.handlers[i].key.fn == fn) {
			this.handlers[i].request.abort();
			this.handlers.splice(i, 1);
		}
	}
	return this;
}
aee.prototype.removeAllListeners = o([
	  function() {
		for(i in this.handlers) {
			this.handlers[i].request.end();
		}
		return this;
	  }
	, function(event) {
		for(i in this.handlers) {
			if(this.handlers[i].key.e == event)
				this.handlers[i].request.end();
		}
		return this;
	  }
]);  
exports.albertEventEmitter = aee;