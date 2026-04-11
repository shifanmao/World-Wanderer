const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Force metro to use local node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

// Disable symlink resolution to avoid workspace conflicts
config.resolver.enableSymlinks = false;

module.exports = config;
