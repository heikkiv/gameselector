var express = require('express');
var fs = require('fs');

var app = module.exports = express.createServer();
var log = null;

app.configure(function(){
  app.set('jsonp callback', true);
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/client'));
});

app.all('/select/:id', function(req, res) {
  console.log(req.params.id + ' selected');
  log.write(req.params.id + '\n');
  res.send({ result: 'ok' })
});

log = fs.createWriteStream('log.txt', {'flags': 'a'});
app.listen(3000);
console.log("app listening on " + 3000);