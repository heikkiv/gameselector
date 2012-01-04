var express = require('express');
var fs = require('fs');
var mongodb = require('mongodb');
var gameRepo = require('./lib/gamerepository.js');

var app = module.exports = express.createServer();
var log = fs.createWriteStream('log.txt', {'flags': 'a'});
var db = new mongodb.Db('gameselector', new mongodb.Server('localhost', 30001, {}), {native_parser:false, auto_reconnect: true});

var gameRepository = new gameRepo.GameRepository(db);

app.configure(function(){
  app.set('jsonp callback', true);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/client'));
});

app.get('/selected', function(req, res) {
  gameRepository.findAll(function(err, games) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      res.send({ result: 'ok', games: games});
    }
  });
});

app.get('/select/:id', function(req, res) {
  gameRepository.find(req.params.id, function(err, game) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      if(game) {
		console.log('Found game: ' + req.params.id);
        res.send({ result: 'ok', game: game});
      } else {
        gameRepository.findIgnored(req.params.id, function(err, game) {
		  console.log('Found ignored game: ' + req.params.id);
          res.send({ result: 'ok', game: game});
        });
      }
    }
  });
});

app.post('/select/:id', function(req, res) {
  console.log(req.params.id + ' selected');
  var game = {
    name: req.body.name,
    appId: req.params.id,
    rating: req.body.rating,
    link: req.body.link,
    pic: req.body.pic,
    price: req.body.price,
	developer: req.body.developer
  };
  gameRepository.saveOrUpdate(game, function(err, game) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      res.send({ result: 'ok' });
    }
  });
});

app.post('/remove/:id', function(req, res) {
  gameRepository.remove(req.params.id, function(err) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      console.log('Removed game ' + req.params.id );
      res.send({ result: 'ok' });
    }
  });
});

app.post('/ignore/:id', function(req, res) {
  var game = {
    name: req.body.name,
    appId: req.params.id,
    rating: req.body.rating,
    link: req.body.link,
    pic: req.body.pic,
    price: req.body.price
  };
  gameRepository.ignore(game, function(err) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      console.log('Ignored game ' + req.params.id );
      res.send({ result: 'ok' });
    }
  });
});

app.post('/removeIgnore/:id', function(req, res) {
  gameRepository.removeIgnore(req.params.id, function(err) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      console.log('Removed game ' + req.params.id );
      res.send({ result: 'ok' });
    }
  });
});

app.get('/ignored', function(req, res) {
  gameRepository.findAllIgnored(function(err, games) {
    if(err) {
      console.error(err);
      res.send({ result: 'fail' });
    } else {
      res.send({ result: 'ok', games: games});
    }
  });
});

app.listen(3000);
console.log("app listening on " + 3000);