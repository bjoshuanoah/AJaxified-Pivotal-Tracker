var express = require('express');
var curl = require('curlrequest');
var pivotal = require("pivotal");


pivotal.useToken("353ddbae79fe8b53ddb36fbe5f389e68");



var app = express();



app.get('/projects', function (req, res) {
	pivotal.getProjects(function (err, ret) {
		res.send(ret);
	});
});

app.get('/members', function (req, res) {
	pivotal.getMemberships([763665], function (err, ret) {
		res.send(ret);
	});
})

app.listen(3000);
console.log('Listening on port 3000');