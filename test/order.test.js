var symlink = require('../');

var verify = function (t, globals, output) {
  symlink(__dirname, globals, function (err, cmds) {
    if (err) {
      t.equal(err, null);
    }
    else {
      t.equal(cmds.length, output.length, "same number of cmds");
      var expected = cmds.map(function (l) {
        return l.match(/\/symlink\/(.*)/)[1];
      });
      t.deepEqual(expected, output, "output deepEquals expected");
    }
    t.done();
  });
};

exports.basic = function (t) {
  // symlink -r test/ -d
  var output = [
    "test/module2 && npm install external1 external2 global1",
    "test/module2 && npm link",
    "test/module3 && npm link module2",
    "test/module3 && npm install global2",
    "test/module3 && npm link",
    "test/module1 && npm link module2 module3",
    "test/module1 && npm install external2",
    "test/module1 && npm link"
  ];
  verify(t, [], output);
};

exports.global = function (t) {
  // symlink -r test/ -d -g global1
  var output = [
    "test/module2 && npm link global1",
    "test/module2 && npm install external1 external2",
    "test/module2 && npm link",
    "test/module3 && npm link module2",
    "test/module3 && npm install global2",
    "test/module3 && npm link",
    "test/module1 && npm link module2 module3",
    "test/module1 && npm install external2",
    "test/module1 && npm link"
  ];
  verify(t, ['global1'], output);
};

exports.globals = function (t) {
  // symlink -r test/ -d -g global1 -g global2
  var output = [
    "test/module2 && npm link global1",
    "test/module2 && npm install external1 external2",
    "test/module2 && npm link",
    "test/module3 && npm link global2 module2",
    "test/module3 && npm link",
    "test/module1 && npm link module2 module3",
    "test/module1 && npm install external2",
    "test/module1 && npm link"
  ];
  verify(t, ['global1', 'global2'], output);
};
