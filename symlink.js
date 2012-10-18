#!/usr/bin/env node
var join = require('path').join
  , $ = require('interlude')
  , cp = require('child_process')
  , async = require('async');

var argv = require('optimist')
  .usage('Usage: $0 -t module1/ module2/ ...')
  .boolean('t')
  .argv;

var deps = {}       // { module name -> [jsonDeps++jsonDevDeps] }
  , names = []      // [ modules given (inferred from paths json) ]
  , pathMaps = {};  // { module name -> given module path }

argv._.forEach(function (m) {
  var json = require(join(__dirname, m, 'package.json'))
    , name = json.name
    , mDeps = $.extend(json.dependencies || {}, json.devDependencies || {});
  deps[name] = Object.keys(mDeps);
  names.push(name);
  pathMaps[name] = m; // so we can find the path back frm the name
});

// partition dependencies by local and foreign
var ownDeps = {};
var foreignDeps = {};
Object.keys(deps).forEach(function (k) {
  ownDeps[k] = deps[k].filter($.elem(names));
  foreignDeps[k] = deps[k].filter($.notElem(names));
});


// sort deps in order of safe linking between each other
// if this is impossible (i.e. a cyclical dependency exists) we throw
var sorted = [];
while (names.length) {
  var len = names.length;
  for (var i = 0; i < names.length; i += 1) {
    var n = names[i];
    // n safe iff no dependencies left in ownDeps[n] intersect names
    if (!$.intersect(names, ownDeps[n]).length) {
      sorted.push(n);
      names.splice(i, 1); // remove name from names we havent sorted yet
      break; // we find one per iteration through names
    }
  }
  if (len === names.length) {
    var err = "cannot link cyclically dependent: " + JSON.stringify(names);
    throw new Error(err);
  }
}

// store ordered to link these modules up
var cmds = [];
sorted.forEach(function (n) {
  // find the directory the module is in by looking at the relative path given
  var cd = 'cd ' + join(__dirname, pathMaps[n]) + ' && ';

  // if tap wanted global and the module uses it, link it to the module
  if (argv.t && deps[n].indexOf('tap') >= 0) {
    cmds.push(cd + 'npm link tap');
  }

  // npm link everything in deps[n] to n
  ownDeps[n].forEach(function (sub) {
    if (argv.t && sub === 'tap') {
      return;
    }
    cmds.push(cd + 'npm link ' + sub);
  });

  // npm install remaining deps
  foreignDeps[n].forEach(function (sub) {
    if (argv.t && sub === 'tap') {
      return;
    }
    cmds.push(cd + 'npm install ' + sub);
  });

  // npm link (to make this available to the modules with more dependencies)
  cmds.push(cd + 'npm link');
});

// create one cp function cmd that execs and cbs to next in async series
var execs = cmds.map(function (cmd) {
  return function (cb) {
    console.log(cmd);
    cp.exec(cmd, function (error, stdout) {
      console.log(stdout);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      cb(error);
    });
  };
});

// exec commands synchronously
async.series(execs);
