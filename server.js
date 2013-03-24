

var express = require('express'),
	curl = require('curlrequest'),
	http = require('http'),
	pivotal = require("pivotal");


var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_token, project_id');

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
  // app.use(express.favicon());
  app.use('/img', express.static(__dirname + '/views/img'));
  app.use('/js', express.static(__dirname + '/views/js'));
  app.use('/css', express.static(__dirname + '/views/css'));
  app.use('/tpl', express.static(__dirname + '/views/tpl'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
});

app.get('/', function (req, res) {
        res.render('index.html');
});

app.get('/google98b653ebf9aa4e44.html', function (req, res) {
        res.render('google98b653ebf9aa4e44.html');
});

app.get('/projects', function (req, res) {
    var api_token = req.headers.api_token;
    pivotal.useToken(api_token);
    pivotal.getProjects(function (err, ret) {
        res.send(ret);
    });
});

app.post('/login', function (req, res) {
            var data = req.body;
            var username = data.username;
            var password = data.password;
            console.log(username, password);
	pivotal.getToken(username, password, function (err, ret) {
            if (!ret) {
                res.json(403, "Usename or Password do not match");
            } else {
                res.send(ret);
            }
	});
});

app.get('/members', function (req, res) {
	var api_token = req.headers.api_token;
    var project_id = req.headers.project_id;
	pivotal.useToken(api_token);
	pivotal.getMemberships([project_id], function (err, ret) {
		res.send(ret);
	});
});

app.get('/stories', function (req, res) {
    var api_token = req.headers.api_token;
    var project_id = req.headers.project_id;
    pivotal.useToken(api_token);
    pivotal.getStories([project_id], {}, function (err, ret) {
        res.send(ret);
    });
});

app.get('/iterations', function (req, res) {
	var api_token = req.headers.api_token;
    var project_id = req.headers.project_id;
	pivotal.useToken(api_token);
	pivotal.getIterations([project_id], 'backlog', function (err, ret) {
		res.send(ret);
	});
});

app.get('/done_iterations', function (req, res) {
	var api_token = req.headers.api_token;
    var project_id = req.headers.project_id;
	pivotal.useToken(api_token);
	pivotal.getIterations([project_id], 'done', function (err, ret) {
		res.send(ret);
	});
});

app.get('/current_iterations', function (req, res) {
	var api_token = req.headers.api_token;
    var project_id = req.headers.project_id;
	pivotal.useToken(api_token);
	pivotal.getIterations([project_id], 'current_backlog', function (err, ret) {
		res.send(ret);
	});
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
