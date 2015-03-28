var symlink = require('../');
var join = require('path').join;

exports.cyclical = function (t) {
  // symlink test/cyclicals -d
  var expct = 'cannot link cyclically dependent: ["module6","module7"]';
  symlink([ join(__dirname, 'cyclicals') ], [], function (err, cmds) {
    if (!err) {
      t.ok(false, "error was not set");
    }
    if (err) {
      t.equal(err.message, expct, "expected error");
      t.equal(cmds, undefined, "no cmds output");
    }
    t.done();
  });
};
