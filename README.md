# symlink [![Build Status](https://secure.travis-ci.org/clux/symlink.png)](http://travis-ci.org/clux/symlink) [![Dependency Status](https://david-dm.org/clux/symlink.png)](https://david-dm.org/clux/symlink)

- Have lots of personal node modules?
- `npm link` them all together?
- find the process of relinking everything after os install tedious?

If you answered YES to all the above, then this module is for you.
Otherwise, it is most certainly not.

## Usage
Install, then run in the directory containing all your repos that youd like to link together (will take all folders that contain a package.json)

```bash
npm install -g symlink
symlink -r repoDir
```

## WHAT DOES IT DO:

- reads the `package.json` of each module and finds their `dependencies` ++ `devDependencies`
- figures out which deps were given
- figures out which deps are external
- orders the modules so that linking can be in a safe order without having to query npmjs.org

Once everything has been ordered, a bunch of child processes are executed in series from the order of least inclusion;

- ownDeps[m].forEach (d) -> `npm link d`
- foreignDeps[m].forEach (d) -> `npm install d`
- `npm link`

I.e. link in all local dependencies, install the rest, then link the module itself so the modules with more inclusions can safely link the module in.

## TAP
If you'd like to link tap to all modules that have it specified in the package.json (instead of having it be installed at every module where it's listed as a foreign dependency) specify a `-t` flag before listing module paths.

## EXAMPLE BECAUSE WTF
Observe a dependency snapshot (of form {moduleName : [deps]}) of my active modules at writing time:

```js
{ autonomy: [ 'operators', 'tap' ],
  combustion: [ 'optimist', 'confortable', 'fsx', 'tap', 'autonomy', 'operators' ],
  confortable: [ 'tap' ],
  deathmatch:
   [ 'browserify',
     'express',
     'express-persona',
     'fsx',
     'interlude',
     'logule',
     'optimist',
     'stylus',
     'tournament',
     'nano',
     'tap' ],
  decay: [ 'tap' ],
  dye: [ 'tap', 'subset' ],
  fsx: [],
  interlude: [ 'autonomy', 'wrappers', 'subset', 'operators', 'tap' ],
  logule: [ 'dye', 'autonomy', 'subset', 'confortable', 'tap' ],
  operators: [ 'tap' ],
  subset: [ 'tap' ],
  symlink: [ 'interlude', 'async', 'optimist', 'tap' ],
  'tap-pessimist': [ 'tap', 'logule' ],
  topiary: [],
  typr: [ 'tap' ],
  wrappers: [ 'tap' ] }
```

symlink will figure out a safe order of commands and perform the following list of actions sequentially via `child_process`;

```js
[ 'cd /home/clux/repos/confortable/ && npm link tap',
  'cd /home/clux/repos/confortable/ && npm link',
  'cd /home/clux/repos/decay/ && npm link tap',
  'cd /home/clux/repos/decay/ && npm link',
  'cd /home/clux/repos/fsx/ && npm link',
  'cd /home/clux/repos/operators/ && npm link tap',
  'cd /home/clux/repos/operators/ && npm link',
  'cd /home/clux/repos/autonomy/ && npm link tap',
  'cd /home/clux/repos/autonomy/ && npm link operators',
  'cd /home/clux/repos/autonomy/ && npm link',
  'cd /home/clux/repos/combustion/ && npm link tap',
  'cd /home/clux/repos/combustion/ && npm link confortable',
  'cd /home/clux/repos/combustion/ && npm link fsx',
  'cd /home/clux/repos/combustion/ && npm link autonomy',
  'cd /home/clux/repos/combustion/ && npm link operators',
  'cd /home/clux/repos/combustion/ && npm install optimist',
  'cd /home/clux/repos/combustion/ && npm link',
  'cd /home/clux/repos/subset/ && npm link tap',
  'cd /home/clux/repos/subset/ && npm link',
  'cd /home/clux/repos/dye/ && npm link tap',
  'cd /home/clux/repos/dye/ && npm link subset',
  'cd /home/clux/repos/dye/ && npm link',
  'cd /home/clux/repos/logule/ && npm link tap',
  'cd /home/clux/repos/logule/ && npm link dye',
  'cd /home/clux/repos/logule/ && npm link autonomy',
  'cd /home/clux/repos/logule/ && npm link subset',
  'cd /home/clux/repos/logule/ && npm link confortable',
  'cd /home/clux/repos/logule/ && npm link',
  'cd /home/clux/repos/tap-pessimist/ && npm link tap',
  'cd /home/clux/repos/tap-pessimist/ && npm link logule',
  'cd /home/clux/repos/tap-pessimist/ && npm link',
  'cd /home/clux/repos/topiary/ && npm link',
  'cd /home/clux/repos/typr/ && npm link tap',
  'cd /home/clux/repos/typr/ && npm link',
  'cd /home/clux/repos/wrappers/ && npm link tap',
  'cd /home/clux/repos/wrappers/ && npm link',
  'cd /home/clux/repos/interlude/ && npm link tap',
  'cd /home/clux/repos/interlude/ && npm link autonomy',
  'cd /home/clux/repos/interlude/ && npm link wrappers',
  'cd /home/clux/repos/interlude/ && npm link subset',
  'cd /home/clux/repos/interlude/ && npm link operators',
  'cd /home/clux/repos/interlude/ && npm link',
  'cd /home/clux/repos/deathmatch/ && npm link tap',
  'cd /home/clux/repos/deathmatch/ && npm link fsx',
  'cd /home/clux/repos/deathmatch/ && npm link interlude',
  'cd /home/clux/repos/deathmatch/ && npm link logule',
  'cd /home/clux/repos/deathmatch/ && npm install browserify',
  'cd /home/clux/repos/deathmatch/ && npm install express',
  'cd /home/clux/repos/deathmatch/ && npm install express-persona',
  'cd /home/clux/repos/deathmatch/ && npm install optimist',
  'cd /home/clux/repos/deathmatch/ && npm install stylus',
  'cd /home/clux/repos/deathmatch/ && npm install tournament',
  'cd /home/clux/repos/deathmatch/ && npm install nano',
  'cd /home/clux/repos/deathmatch/ && npm link',
  'cd /home/clux/repos/symlink/ && npm link tap',
  'cd /home/clux/repos/symlink/ && npm link interlude',
  'cd /home/clux/repos/symlink/ && npm install async',
  'cd /home/clux/repos/symlink/ && npm install optimist',
  'cd /home/clux/repos/symlink/ && npm link' ]
```

NB: This is with the [tap] option enabled.

If you have a local/chowned install of node (such that creating links to globally installed modules can be done sans-sudo) then `symlink` can run sudo free too.

## Try before you buy
After cloning a bunch of node git repos, you can see how it would link these together first by running symlink with the dry-run `-d` flag.

## License
MIT-Licensed. See LICENSE file for details.
