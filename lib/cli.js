var cp = require('child_process');
var path = require('path');
var async = require('async');

var defaultHandler = function (cmds, done) {
  cmds.forEach(function (cmd) {
    console.log(cmd);
  });
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

module.exports = function (argv, done) {
  // repoDirs are the unnamed arguments (usually just one super dir)
  var dirs = argv._.map(function (dir) {
    return path.join(process.cwd(), dir);
  });

  // execute main module function with one of the handlers as the cb
  var handler = argv.e ? executeHandler : defaultHandler;
  require('./symlink')(dirs, argv.g || [], function (err, cmds) {
    err ? done(err) : handler(cmds, done);
  });
};
