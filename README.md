# symlink
[![npm status](http://img.shields.io/npm/v/symlink.svg)](https://www.npmjs.org/package/symlink)
[![build status](https://secure.travis-ci.org/clux/symlink.svg)](http://travis-ci.org/clux/symlink)
[![dependency status](https://david-dm.org/clux/symlink.svg)](https://david-dm.org/clux/symlink)
[![coverage status](http://img.shields.io/coveralls/clux/symlink.svg)](https://coveralls.io/r/clux/symlink)

- Manage lots of node modules?
- Do you `npm link` multiple modules together to ensure they all work with latest while developing?
- Find the process of linking together multiple modules tedious?

If you answered YES to all the above, then this module is for you.

## Usage
Install, then give it a set of directories containing packages that you would like to link together (will parse all immediate subdirectories containing a package.json).

```sh
npm install -g symlink
symlink repoDir # prints a list of commands that CAN be executed
```

## Execute
To execute these commands in series run symlink by either piping to `sh` if pipes are convenient for your use case, or use the `--execute` flag which also gives you one log per command.

```sh
symlink repoDir --execute
```

## Example
Linking together the related tournament modules from [clux](https://github.com/clux?tab=repositories)'s repositories, to ensure they all work together, and all get the same test frameworks (though that's mostly just convenience):

NB: for readability the full paths have been shortened

```sh
clux@kjttks ~/trn $ symlink . -g nodeunit -g jscoverage -g nodeunit
cd tournament && npm link nodeunit jscoverage coveralls
cd tournament && npm install interlude
cd tournament && npm link
cd duel && npm link nodeunit jscoverage coveralls tournament
cd duel && npm install interlude
cd duel && npm link
cd ffa && npm link nodeunit jscoverage coveralls tournament
cd ffa && npm install interlude group
cd ffa && npm link
cd groupstage && npm link nodeunit jscoverage coveralls tournament
cd groupstage && npm install interlude roundrobin group
cd groupstage && npm link
cd masters && npm link nodeunit jscoverage coveralls tournament ffa
cd masters && npm install interlude
cd masters && npm link
cd tiebreaker && npm link nodeunit jscoverage coveralls tournament groupstage ffa
cd tiebreaker && npm install interlude
cd tiebreaker && npm link
cd tourney && npm link nodeunit jscoverage coveralls tournament
cd tourney && npm install interlude
cd tourney && npm link
cd ffa-tb && npm link nodeunit jscoverage coveralls tourney tiebreaker ffa
cd ffa-tb && npm install autonomy
cd ffa-tb && npm link
cd groupstage-tb && npm link nodeunit jscoverage coveralls tiebreaker groupstage tourney
cd groupstage-tb && npm link
cd groupstage-tb-duel && npm link nodeunit jscoverage duel groupstage-tb tourney groupstage
cd groupstage-tb-duel && npm install autonomy
cd groupstage-tb-duel && npm link

# all looks sane - execute:
$ kjttks@clux ~/repos $ !! | sh
```

The most independent modules (tournament) gets their missing dependencies installed first, then gets npm linked so the more requiring modules (specific implementations) can npm link in these.

If you have a local/chowned install of node (such that creating links to globally installed modules can be done sans-sudo) then `symlink` can execute sudo free too.

## What it does

- reads the `package.json` of each module founds in the given directory and collects their `dependencies` and `devDependencies`
- figures out which deps are local (present on one of the repoDirs)
- figures out which deps are external (complement)
- orders the modules so that linking can be in a safe order without having to query npmjs.org more than necessary

Once everything has been ordered, a bunch of commands are generated for each module from the order of least inclusion;

- `npm link (localDeps) ∪ ((globals ∩ externalDeps))`
- `npm install (externalDeps ∖ globals)`
- `npm link`

I.e. link in all locally available dependencies + extenal globals that were requested explicitly, install the rest, then link the module itself so the modules with more inclusions can safely link the module in.

## Globally linked modules
Test dependencies are often the same everywhere, and, to save querying npmjs, you could just give them the version you have installed (provided it is compatible, and installed globally):

In the example above, every module that uses `jscoverage`, `nodeunit` or `coveralls` will get the relevant modules linked in.

## License
MIT-Licensed. See LICENSE file for details.
