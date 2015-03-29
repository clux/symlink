var cp = require('child_process');
var path = require('path');
var async = require('async');

var dryRunHandler = function (cmds, done) {
  console.log(JSON.stringify(cmds, null, " "));
  done(null);
};

var executeHandler = function (cmds, done) {
  var iterator = function (cmd, cb) {
    console.log(cmd);
    cp.exec(cmd, function (err, stdout) {
      console.log(stdout);
      cb(err, stdout);
    });
  };
  async.mapSeries(cmds, iterator, done);
};

exports.run = function (argv, done) {
  // repoDirs are the unnamed arguments (usually just one super dir)
  var dirs = argv._.map(function (dir) {
    return path.join(process.cwd(), dir);
  });

  // execute main module function with one of the handlers as the cb
  var handler = argv.d ? dryRunHandler : executeHandler;
  require('./symlink')(dirs, argv.g || [], function (err, cmds) {
    if (err) {
      return done(err);
    }
    handler(cmds, done);
  });
};
