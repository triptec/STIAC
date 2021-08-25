// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const extraNodeModules = {
  'STIAC-common': path.resolve(__dirname + '/../STIAC-common'),
};
const watchFolders = [
  path.resolve(__dirname + '/../STIAC-common')
];
const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = extraNodeModules;
config.watchFolders = watchFolders;
console.log(config)
module.exports = config;
