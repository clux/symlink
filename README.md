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

Once everything has been ordered, a bunch of child processes are executed in series for each module from the order of least inclusion;

- `npm link (globals intersect foreignDeps)`
- `npm link (internalDeps)`
- `npm install (foreignDeps)`
- `npm link`

I.e. link in all local global and internal dependencies, install the rest, then link the module itself so the modules with more inclusions can safely link the module in.

## Globally linked modules
If you'd like to link, say, [tap](https://npmjs.org/package/tap) to all modules that have it specified in the package.json (instead of having it be installed at every module where it's listed as a foreign dependency) specify a `-g tap` flag. This flag can be specified many times for as many modules you'd like to link in.

## Try before you buy
After cloning a bunch of node git repos, you can see how it would link these together first by running symlink with the dry-run `-d` flag.

## EXAMPLE BECAUSE WTF
When I reinstall my linux, I git clone all my repos and let symlink figure out a safe order of commands and perform the following list of actions sequentially via `child_process`;

```
kjttks@clux ~/repos $ symlink -r . -g tap -d
[
 "cd ./blog && npm install marked ecstatic promzard async browserify ejs",
 "cd ./blog && npm link",
 "cd ./confortable && npm link tap",
 "cd ./confortable && npm link",
 "cd ./decay && npm link tap",
 "cd ./decay && npm link",
 "cd ./fsx && npm link",
 "cd ./irc-stream && npm link tap",
 "cd ./irc-stream && npm install irc",
 "cd ./irc-stream && npm link",
 "cd ./operators && npm link tap",
 "cd ./operators && npm link",
 "cd ./autonomy && npm link tap",
 "cd ./autonomy && npm link operators",
 "cd ./autonomy && npm link",
 "cd ./combustion && npm link tap",
 "cd ./combustion && npm link confortable fsx autonomy operators",
 "cd ./combustion && npm install optimist",
 "cd ./combustion && npm link",
 "cd ./sdp-transform && npm link tap",
 "cd ./sdp-transform && npm link",
 "cd ./splitter && npm link tap",
 "cd ./splitter && npm link",
 "cd ./statesoftheworld && npm link tap",
 "cd ./statesoftheworld && npm link",
 "cd ./subset && npm link tap",
 "cd ./subset && npm link",
 "cd ./curvefever-stats && npm link tap",
 "cd ./curvefever-stats && npm link subset confortable",
 "cd ./curvefever-stats && npm install request cheerio async",
 "cd ./curvefever-stats && npm link",
 "cd ./interlude && npm link tap",
 "cd ./interlude && npm link autonomy subset operators",
 "cd ./interlude && npm link",
 "cd ./symlink && npm link tap",
 "cd ./symlink && npm link interlude",
 "cd ./symlink && npm install async optimist",
 "cd ./symlink && npm link",
 "cd ./topiary && npm link",
 "cd ./tournament && npm link tap",
 "cd ./tournament && npm link interlude",
 "cd ./tournament && npm link",
 "cd ./tournament-components && npm link tournament",
 "cd ./tournament-components && npm install tape",
 "cd ./tournament-components && npm link",
 "cd ./trials && npm link tap",
 "cd ./trials && npm link",
 "cd ./dye && npm link tap",
 "cd ./dye && npm link trials subset",
 "cd ./dye && npm link",
 "cd ./tub && npm link tap",
 "cd ./tub && npm link splitter",
 "cd ./tub && npm install dev-null",
 "cd ./tub && npm link",
 "cd ./typr && npm link tap",
 "cd ./typr && npm link",
 "cd ./logule && npm link tap",
 "cd ./logule && npm link dye autonomy subset confortable typr",
 "cd ./logule && npm link",
 "cd ./gu && npm link tap",
 "cd ./gu && npm link logule",
 "cd ./gu && npm install hot-reload",
 "cd ./gu && npm link",
 "cd ./cleverbot-irc && npm link dye gu irc-stream confortable",
 "cd ./cleverbot-irc && npm install levenshtein cleverbot-node suncalc irc-colors",
 "cd ./cleverbot-irc && npm link",
 "cd ./curvefever-bot && npm link tap",
 "cd ./curvefever-bot && npm link curvefever-stats gu confortable",
 "cd ./curvefever-bot && npm link",
 "cd ./meshrtc && npm link logule",
 "cd ./meshrtc && npm install shoe emit-stream bean bonzo qwery domready ecstatic mux-demux pause-stream dnode browserify",
 "cd ./meshrtc && npm link",
 "cd ./wolfram-alpha && npm link tap",
 "cd ./wolfram-alpha && npm install request libxmljs",
 "cd ./wolfram-alpha && npm link",
 "cd ./wolfram-irc && npm link gu irc-stream confortable wolfram-alpha",
 "cd ./wolfram-irc && npm link",
 "cd ./wrappers && npm link tap",
 "cd ./wrappers && npm link"
]
```

NB: for readability, the full paths herein have been stripped:

Without the `-d` flag, these commands would be executed in this order.
You can see the most independent modules gets their missing dependencies installed first, then gets npm linked so the more requiring modules can npm link in these.

If you have a local/chowned install of node (such that creating links to globally installed modules can be done sans-sudo) then `symlink` can run sudo free too.

## License
MIT-Licensed. See LICENSE file for details.
