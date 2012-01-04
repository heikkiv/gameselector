exports.GameRepository = function(db) {
  this.db = db;

  db.open(function(err, db) {
    if(err) {
      console.error(err);
    } else {
      this.db = db;
      console.log('MongoDB connection opened');
    }
  });

  this.findAll = function(callback) {
    db.collection('games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.find({}, {}).toArray(function(err, games) {
          if(err) {
            callback(err);
          } else {
            callback(null, games);
          }
        });
      }
    });
  }

  this.find = function(id, callback) {
    db.collection('games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.findOne({appId: id}, {}, function(err, game) {
          if(err) {
            callback(err);
          } else {
            callback(null, game);
          }
        });
      }
    });
  }

  this.saveOrUpdate = function (game, callback) {
    db.collection('games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.findOne({appId: game.appId}, {}, function(err, savedGame) {
          if(err) {
            callback(err);
          } else {
            if(savedGame) {
              game._id = savedGame._id;
            }
            collection.save(game, {safe: true}, function(err) {
              callback(err, game);
            });
          }
        });
      }
    });
  }

  this.remove = function(id, callback) {
    db.collection('games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.remove({appId: id}, {}, function(err) {
          if(err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      }
    });
  }

  this.ignore = function (game, callback) {
    db.collection('ignored_games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.findOne({appId: game.appId}, {}, function(err, ignoredGame) {
          if(err) {
            callback(err);
          } else {
            if(ignoredGame) {
              game._id = ignoredGame._id;
            }
            collection.save(game, {safe: true}, function(err) {
              callback(err, game);
            });
          }
        });
      }
    });
  }

  this.removeIgnore = function(id, callback) {
    db.collection('ignored_games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.remove({appId: id}, {}, function(err) {
          if(err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      }
    });
  }

  this.findIgnored = function(id, callback) {
    db.collection('ignored_games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.findOne({appId: id}, {}, function(err, game) {
          if(err) {
            callback(err);
          } else {
            callback(null, game);
          }
        });
      }
    });
  }

  this.findAllIgnored = function(callback) {
    db.collection('ignored_games', function(err, collection) {
      if(err) {
        callback(err);
      } else {
        collection.find({}, {}).toArray(function(err, games) {
          if(err) {
            callback(err);
          } else {
            callback(null, games);
          }
        });
      }
    });
  }

};