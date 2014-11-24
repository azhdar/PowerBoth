var addon = require('./node_modules/elastic-beam/build/Release/power_ctl')
var pwr_ctl = addon.PowerCtl()
var low = require('lowdb')
var db = low('db.json')

var feathers = require('feathers');
var bodyParser = require('body-parser');

var myService = {
  find: function(params, callback) {},
  get: function(id, params, callback) {
  	try {
      callback(null, this.getTodo(id));
    } catch(error) {
      callback(error);
    }
  },
  create: function(data, params, callback) {},
  update: function(id, data, params, callback) {},
  patch: function(id, data, params, callback) {},
  remove: function(id, params, callback) {},
  setup: function(app, path) {}
}

var app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  // Parse HTTP bodies
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Host the current directory (for index.html)
  .use(feathers.static(__dirname))
  // Host our Todos service on the /todos path
  .use('/power', powerService);


/*app.get('/toggle/:id', function(req, res){
	var id = parseInt(req.params.id)
	if (id >= 1 && id <= 4) {
		pwr_ctl.toggle(parseInt(req.params.id))
		var body = req.params.id + ' toggled !'
		res.setHeader('Content-Type', 'text/plain')
		res.setHeader('Content-Length', Buffer.byteLength(body))
		res.end(body)
	}
})

app.get('/fixtures', function(req, res){
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


