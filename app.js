var addon = require('./node_modules/elastic-beam/build/Release/power_ctl')
var pwr_ctl = addon.PowerCtl()
var low = require('lowdb')
var db = low('db.json')

// Requires
var express = require('express')
var socketio = require('socket.io')

// Configuration
var appConfig = {
    staticPath: __dirname + '/static'
};

// Application
var app = express()
var server = require('http').createServer(app)
var io = socketio.listen(server)

// Middlewares
app.use(express.static(appConfig.staticPath))
app.use(function(req,res,next){
    res.status(404).send('404 Not Found. Sorry.\n');
})

server.listen(80, function() {
	console.log('Power is ready!')
})

// REST
/*app.get('/toggle/:id', function(req, res){
	var id = parseInt(req.params.id)
	if (id >= 1 && id <= 4) {
		pwr_ctl.toggle(parseInt(req.params.id))
		var body = req.params.id + ' toggled !'
		res.setHeader('Content-Type', 'text/plain')
		res.setHeader('Content-Length', Buffer.byteLength(body))
		res.end(body)
	}
})*/

// Fixtures
/*app.get('/fixtures', function(req, res){
	db('power_1').push({ on: 1020, off: 1320})
	db('power_2').push({ on: 1020, off: 1320})
	db('power_3').push({ on: 1020, off: 1320})
	db('power_4').push({ on: 0, off: 1440})
})*/

io.on('connection', function (socket) {

	console.log('New client connected!')

	socket.emit('message', 'Connected to the Power Server!')

	for (var i = 1; i <= 4; i++) { 
	    socket.emit('state', '{"power":' + i + ',"isOn":' + pwr_ctl.isOn(parseInt(i)) + '}')
	}

	socket.emit('power', db('power').value())	

	socket.on('toggle', function(id) {
		var id = parseInt(id)
		if (id >= 1 && id <= 4) {
			pwr_ctl.toggle(id)
			socket.emit('message', id + ' toggled')
			socket.emit('state', '{"power":' + id + ',"isOn":' + pwr_ctl.isOn(id) + '}')
		}
	})

	socket.on('state', function(id) {
		var id = parseInt(id)
		if (id >= 1 && id <= 4) {
			socket.emit('state', '{"power":' + id + ',"isOn":' + pwr_ctl.isOn(parseInt(id)) + '}')
		}
	})

})


