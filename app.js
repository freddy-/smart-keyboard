var express = require('express');
var bodyParser = require('body-parser');
var robot = require("robotjs");
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send/string', function(req, res){
	res.end();
	console.log(decodeURI(req.body.string));
	robot.typeString(decodeURI(req.body.string));
});

app.get('/send/key/:key', function(req, res){
	res.end();
	robot.keyTap(req.params.key);
});

app.get('/send/clear', function(req, res){
	res.end();
	robot.keyTap('a', 'control');
	robot.keyTap('delete');
});

app.get('/send/ctrla', function(req, res){
	res.end();
	robot.keyTap('a', 'control');
});

app.post('/send/mouse/move', function(req, res){
	res.end();

	var mousePosition = robot.getMousePos();
	var newX = mousePosition.x + req.body.x;
	var newY = mousePosition.y + req.body.y;

	robot.moveMouse(newX, newY);
});

app.get('/send/mouse/scroll/:direction', function(req, res){
	res.end();

	if(req.params.direction === "up"){
		robot.scrollMouse(1, "up");
	}else if(req.params.direction === "down"){
		robot.scrollMouse(1, "down");
	}

});


app.get('/send/mouse/click', function(req, res){
	res.end();
	robot.mouseClick();
});

var server = app.listen(80, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("listening %s:%s", host, port);
});