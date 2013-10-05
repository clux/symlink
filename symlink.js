#!/usr/bin/env node
var join = require('path').join
  , $ = require('interlude')
  , fs = require('fs')
  , cp = require('child_process')
  , async = require('async')
  , cwd = process.cwd();

var argv = require('optimist')
  .usage('Usage: $0 [-td] -r repoFolder')
  .describe('g', 'globally-link')
  .boolean('d')
  .describe('d', 'dry-run')
  .demand(['r'])
  .describe('r', 'repoFolder')
  .argv;

var deps = {}         // { module name -> [jsonDeps++jsonDevDeps] }
  , ownDeps = {}      // deps in names
  , foreignDeps = {}  // deps not in names
  , absPaths = {};    // { module name -> abs module path }

var globals = argv.g ?
  (Array.isArray(argv.g) ? argv.g : [argv.g]):
  [];

var dirs = fs.readdirSync(argv.r).filter(function(str) {
  return fs.existsSync(join(cwd, argv.r, str, 'package.json'));
});

var names = dirs.map(function (m) {
  var json = require(join(cwd, argv.r, m, 'package.json'))
    , name = json.name
    , mDeps = $.extend(json.dependencies || {}, json.devDependencies || {});
  deps[name] = Object.keys(mDeps);
  absPaths[name] = join(cwd, argv.r, m);
  return name;
});

// partition dependencies
Object.keys(deps).forEach(function (k) {
  ownDeps[k] = deps[k].filter($.elem(names));
  foreignDeps[k] = deps[k].filter($.notElem(names));
});

// sort deps in order of safe linking between each other
var sorted = $.range(names.length).map(function () {
  var safe = $.firstBy(function (n) {
    // safe to link iff no local deps unlinked
    return !$.intersect(ownDeps[n], names).length;
  }, names);

  if (!safe) {
    // impossible to link a to b if b also tries to link to a without querying npm
    var err = "cannot link cyclically dependent: " + JSON.stringify(names);
    throw new Error(err);
  }
  names.splice(names.indexOf(safe), 1); // remove it from names
  return safe;
});

var cmds = [];
sorted.forEach(function (n) {
  // then find all commands required for each module in the found safe order
  var cd = 'cd ' + absPaths[n] + ' && ';

  // if tap wanted global and the module uses it, link it to the module
  var ignored = $.intersect(globals, deps[n]);
  if (ignored.length > 0) {
    cmds.push(cd + 'npm link ' + ignored.join(' '));
  }

  // npm link everything in deps[n] to n
  var ownToLink = ownDeps[n].filter($.notElem(ignored));
  if (ownToLink.length > 0) {
    cmds.push(cd + 'npm link ' + ownToLink.join(' '));
  }

  // npm install remaining deps
  var remaining = foreignDeps[n].filter($.notElem(ignored));
  if (remaining.length > 0) {
    cmds.push(cd + 'npm install ' + remaining.join(' '));
  }

  // npm link (to make this available to the modules with more dependencies)
  cmds.push(cd + 'npm link');
});

if (argv.d) { // dry run
  return console.log(JSON.stringify(cmds, null, " "));
}

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
