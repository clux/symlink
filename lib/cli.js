var cp = require('child_process');
var path = require('path');
var async = require('async');

var dryRunHandler = function (cmds, done) {
  console.log(JSON.stringify(cmds, null, " "));
  done();
};

var executeHandler = function (cmds, done) {
  // create one cp function cmd that execs and cbs to next in async series
  var execs = cmds.map(function (cmd) {
    return function (cb) {
      console.log(cmd); // npm link xs && npm install ys && npm link
      cp.exec(cmd, function (error, stdout) {
        console.log(stdout);
        cb(error);
      });
    };
  });

  // exec commands synchronously
  async.series(execs, done);
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
