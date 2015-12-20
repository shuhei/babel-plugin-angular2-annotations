require('babel-core/register')({
  plugins: [
    './../src',
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-flow-strip-types"
  ],
  presets: ['es2015']
});

require('./angular2');
