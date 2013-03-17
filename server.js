

var express = require('express'),
	curl = require('curlrequest'),
	http = require('http'),
	pivotal = require("pivotal");


var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_token');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);

  }
  else {
    next();
  }
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(allowCrossDomain);
  app.use(express.favicon());
  app.use('/img', express.static(__dirname + '/images'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
});

app.get('/projects', function (req, res) {
	var api_token = req.headers.api_token;
	pivotal.useToken(api_token);
	pivotal.getProjects(function (err, ret) {
		res.send(ret);
	});
});

app.get('/members', function (req, res) {
	var api_token = req.headers.api_token;
	pivotal.useToken(api_token);
	pivotal.getMemberships([673099], function (err, ret) {
		res.send(ret);
	});
});

app.get('/iterations', function (req, res) {
	var api_token = req.headers.api_token;
	pivotal.useToken(api_token);
	pivotal.getIterations([673099], 'backlog', function (err, ret) {
		res.send(ret);
	});
});

app.get('/done_iterations', function (req, res) {
	var api_token = req.headers.api_token;
	pivotal.useToken(api_token);
	pivotal.getIterations([673099], 'done', function (err, ret) {
		res.send(ret);
	});
});

app.get('/current_iterations', function (req, res) {
	var api_token = req.headers.api_token;
	pivotal.useToken(api_token);
	pivotal.getIterations([673099], 'current_backlog', function (err, ret) {
		res.send(ret);
	});
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});