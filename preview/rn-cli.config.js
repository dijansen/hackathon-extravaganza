'use strict';

var path = require('path');
var blacklist = require('./node_modules/react-native/packager/blacklist');

var config = {
  getProjectRoots() {
    return getRoots();
  },

  getBlacklistRE() {
    return blacklist([
      new RegExp(path.resolve(__dirname, '[^\\\\./]+', 'node_modules', '.*'))
    ]);
  },

  getAssetExts() {
    return ['obj', 'mtl'];
  },
};

function getRoots() {
  var root = process.env.REACT_NATIVE_APP_ROOT;
  if (root) {
    return [path.resolve(root)];
  }
  return [path.resolve(__dirname)];
}

module.exports = config;
