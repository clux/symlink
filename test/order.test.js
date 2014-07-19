var cp = require('child_process');

var verify = function (t, flags, output) {
  cp.exec('./symlink.js ' + flags, function (err, stdout, stderr) {
    if (err || stderr) {
      console.error(err, stderr)
      t.equal(err, null, "err executing");
      t.equal(stderr, null, "err executing");
    }
    else {
      t.ok(stdout, flags + ' worked');
      var json = JSON.parse(stdout);
      t.ok(Array.isArray(json), 'array of output');
      t.equal(json.length, output.length, "same number of cmds");
      var expected = json.map(function (l) {
        return l.match(/\/symlink\/(.*)/)[1];
      });
      t.deepEqual(expected, output, "output deepEquals expected");
    }
    t.done();
  });
};

exports.basic = function (t) {
  var flags = '-r test/ -d';
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
  verify(t, flags, output);
};

exports.global = function (t) {
  var flags = '-r test/ -d -g global1';
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
  verify(t, flags, output);
};

exports.globals = function (t) {
  var flags = '-r test/ -d -g global1 -g global2';
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
  verify(t, flags, output);
};
