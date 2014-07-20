module.exports = process.env.SYMLINK_COV
  ? require('./lib-cov/symlink.js')
  : require('./lib/symlink.js');
