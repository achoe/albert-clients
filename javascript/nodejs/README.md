## Node.js Client for albert

Exposes similar functions as [events.EventEmitter](http://nodejs.org/api/events.html)

## How to use

First, create an EventEmitter, specifying the event server to listen on:

```javascript
var albert_client = require('albert-client');

var handler = new albert_client.EventEmitter("http://example.com:30301");
```

#### To listen on events
Every .on() opens a new connection to the server(unless a connection with same EVENT_NAME_OR_MASK* already exists)
```javascript
handler.on('EVENT_NAME_OR_MASK*', function(json) {
	console.log(json);
});
```


#### Emitting events

callbackData tells you if the emit went well, and returns the event id incase you want to update the event

```javascript
handler.emit('EVENT_NAME', function(callbackData) {
});

handler.emit('EVENT_NAME', 'OK', function(callbackData) {
});

handler.emit('EVENT_NAME', 'OK', 100, function(callbackData) {
});

handler.emit('EVENT_NAME', 'OK', 100, { data1: "value", data2: "value2" }, function(callbackData) {
});
```


#### Updating events
Updating is an extra feature from normal Node.js events. It lets you change the status and progress of an event, and supply new data for it if needed

```javascript
handler.update(event_id, function(callbackData) {
});

handler.update(event_id, 'OK', function(callbackData) {
});

handler.update(event_id, 'OK', 100, function(callbackData) {
});

handler.update(event_id, 'OK', 100, { data1: "value", data2: "value2" }, function(callbackData) {
});
```

#### Remove listeners

```javascript

handler.removeListener('EVENT_NAME_OR_MASK*', callbackFunction);

handler.removeAllListeners(); // removes everything

handler.removeAllListeners('EVENT_NAME_OR_MASK*'); // removes all listeners on 'EVENT_NAME_OR_MASK*'
```
