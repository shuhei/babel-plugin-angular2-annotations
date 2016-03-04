'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var babel = require('babel-core');

var testing = require('./testing');

require('babel-core/register')({
  presets: ['es2015']
});

var fixtures = [
  'no-annotation',
  'normal-class',
  'no-constructor',
  'export-named-class',
  'export-default-class',
  'various-types'
];
var results = fixtures.map(function (fixture) {
  return testing.test(fixture, testTransform.bind(null, fixture));
});
testing.printResult(results);

function testTransform(fixtureName) {
  var fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js')).toString();
  var expected = fs.readFileSync(path.resolve(__dirname, 'fixtures', fixtureName, 'expected.js')).toString();
  var actual = babel.transform(fixture, {
    plugins: [
      './src',
      'external-helpers-2',
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-flow-strip-types'
    ],
    presets: ['es2015']
  }).code;

  assert.equal(actual + '\n', expected);
}
