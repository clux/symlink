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

- (globals `intersect` ownDeps).forEach (g) -> `npm link g`
- ownDeps[m].forEach (d) -> `npm link d`
- foreignDeps[m].forEach (d) -> `npm install d`
- `npm link`

I.e. link in all local dependencies, install the rest, then link the module itself so the modules with more inclusions can safely link the module in.

## Globally linked modules
If you'd like to link, say, [tap](https://npmjs.org/package/tap) to all modules that have it specified in the package.json (instead of having it be installed at every module where it's listed as a foreign dependency) specify a `-g tap` flag. This flag can be specified many times for as many modules you'd like to link in.

## Try before you buy
After cloning a bunch of node git repos, you can see how it would link these together first by running symlink with the dry-run `-d` flag.

## EXAMPLE BECAUSE WTF
When I reinstall my linux, I git clone all my repos and let symlink figure out a safe order of commands and perform the following list of actions sequentially via `child_process`;

```
/home/clux/repos $ symlink -r . -d -g tap
[
 "cd /home/clux/repos/confortable && npm link tap",
 "cd /home/clux/repos/confortable && npm link",
 "cd /home/clux/repos/decay && npm link tap",
 "cd /home/clux/repos/decay && npm link",
 "cd /home/clux/repos/deusexlogin && npm install tape",
 "cd /home/clux/repos/deusexlogin && npm link",
 "cd /home/clux/repos/fsx && npm link",
 "cd /home/clux/repos/icebreaker && npm install tape",
 "cd /home/clux/repos/icebreaker && npm link",
 "cd /home/clux/repos/irc-stream && npm link tap",
 "cd /home/clux/repos/irc-stream && npm install irc",
 "cd /home/clux/repos/irc-stream && npm link",
 "cd /home/clux/repos/operators && npm link tap",
 "cd /home/clux/repos/operators && npm link",
 "cd /home/clux/repos/autonomy && npm link tap",
 "cd /home/clux/repos/autonomy && npm link operators",
 "cd /home/clux/repos/autonomy && npm link",
 "cd /home/clux/repos/combustion && npm link tap",
 "cd /home/clux/repos/combustion && npm link confortable",
 "cd /home/clux/repos/combustion && npm link fsx",
 "cd /home/clux/repos/combustion && npm link autonomy",
 "cd /home/clux/repos/combustion && npm link operators",
 "cd /home/clux/repos/combustion && npm install optimist",
 "cd /home/clux/repos/combustion && npm link",
 "cd /home/clux/repos/sdp-transform && npm link tap",
 "cd /home/clux/repos/sdp-transform && npm link",
 "cd /home/clux/repos/splitter && npm link tap",
 "cd /home/clux/repos/splitter && npm link",
 "cd /home/clux/repos/statesoftheworld && npm link tap",
 "cd /home/clux/repos/statesoftheworld && npm link",
 "cd /home/clux/repos/subset && npm link tap",
 "cd /home/clux/repos/subset && npm link",
 "cd /home/clux/repos/curvefever-stats && npm link tap",
 "cd /home/clux/repos/curvefever-stats && npm link subset",
 "cd /home/clux/repos/curvefever-stats && npm link confortable",
 "cd /home/clux/repos/curvefever-stats && npm install request",
 "cd /home/clux/repos/curvefever-stats && npm install cheerio",
 "cd /home/clux/repos/curvefever-stats && npm install async",
 "cd /home/clux/repos/curvefever-stats && npm link",
 "cd /home/clux/repos/interlude && npm link tap",
 "cd /home/clux/repos/interlude && npm link autonomy",
 "cd /home/clux/repos/interlude && npm link subset",
 "cd /home/clux/repos/interlude && npm link operators",
 "cd /home/clux/repos/interlude && npm link",
 "cd /home/clux/repos/symlink && npm link tap",
 "cd /home/clux/repos/symlink && npm link interlude",
 "cd /home/clux/repos/symlink && npm install async",
 "cd /home/clux/repos/symlink && npm install optimist",
 "cd /home/clux/repos/symlink && npm link",
 "cd /home/clux/repos/topiary && npm link",
 "cd /home/clux/repos/tournament && npm link tap",
 "cd /home/clux/repos/tournament && npm link interlude",
 "cd /home/clux/repos/tournament && npm link",
 "cd /home/clux/repos/tournament-components && npm link tournament",
 "cd /home/clux/repos/tournament-components && npm install tape",
 "cd /home/clux/repos/tournament-components && npm link",
 "cd /home/clux/repos/trials && npm link tap",
 "cd /home/clux/repos/trials && npm link",
 "cd /home/clux/repos/dye && npm link tap",
 "cd /home/clux/repos/dye && npm link trials",
 "cd /home/clux/repos/dye && npm link subset",
 "cd /home/clux/repos/dye && npm link",
 "cd /home/clux/repos/tub && npm link tap",
 "cd /home/clux/repos/tub && npm link splitter",
 "cd /home/clux/repos/tub && npm install dev-null",
 "cd /home/clux/repos/tub && npm link",
 "cd /home/clux/repos/typr && npm link tap",
 "cd /home/clux/repos/typr && npm link",
 "cd /home/clux/repos/logule && npm link tap",
 "cd /home/clux/repos/logule && npm link dye",
 "cd /home/clux/repos/logule && npm link autonomy",
 "cd /home/clux/repos/logule && npm link subset",
 "cd /home/clux/repos/logule && npm link confortable",
 "cd /home/clux/repos/logule && npm link typr",
 "cd /home/clux/repos/logule && npm link",
 "cd /home/clux/repos/gu && npm link tap",
 "cd /home/clux/repos/gu && npm link logule",
 "cd /home/clux/repos/gu && npm install hot-reload",
 "cd /home/clux/repos/gu && npm link",
 "cd /home/clux/repos/cleverbot-irc && npm link dye",
 "cd /home/clux/repos/cleverbot-irc && npm link gu",
 "cd /home/clux/repos/cleverbot-irc && npm link irc-stream",
 "cd /home/clux/repos/cleverbot-irc && npm link confortable",
 "cd /home/clux/repos/cleverbot-irc && npm install levenshtein",
 "cd /home/clux/repos/cleverbot-irc && npm install cleverbot-node",
 "cd /home/clux/repos/cleverbot-irc && npm install suncalc",
 "cd /home/clux/repos/cleverbot-irc && npm install irc-colors",
 "cd /home/clux/repos/cleverbot-irc && npm link",
 "cd /home/clux/repos/curvefever-bot && npm link tap",
 "cd /home/clux/repos/curvefever-bot && npm link curvefever-stats",
 "cd /home/clux/repos/curvefever-bot && npm link gu",
 "cd /home/clux/repos/curvefever-bot && npm link confortable",
 "cd /home/clux/repos/curvefever-bot && npm link",
 "cd /home/clux/repos/wolfram-alpha && npm link tap",
 "cd /home/clux/repos/wolfram-alpha && npm install request",
 "cd /home/clux/repos/wolfram-alpha && npm install libxmljs",
 "cd /home/clux/repos/wolfram-alpha && npm link",
 "cd /home/clux/repos/wolfram-irc && npm link gu",
 "cd /home/clux/repos/wolfram-irc && npm link irc-stream",
 "cd /home/clux/repos/wolfram-irc && npm link confortable",
 "cd /home/clux/repos/wolfram-irc && npm link wolfram-alpha",
 "cd /home/clux/repos/wolfram-irc && npm link",
 "cd /home/clux/repos/wrappers && npm link tap",
 "cd /home/clux/repos/wrappers && npm link"
]
```

Without the `-d` flag, these commands would be executed in this order.
You can see the most independent modules gets their missing dependencies installed first, then gets npm linked so the more requiring modules can npm link in these.

If you have a local/chowned install of node (such that creating links to globally installed modules can be done sans-sudo) then `symlink` can run sudo free too.

## License
MIT-Licensed. See LICENSE file for details.
