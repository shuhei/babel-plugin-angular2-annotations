'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var babel = require('babel-core');

function test(fixtureName) {
  console.log('-', fixtureName);
  var fixture = fs.readFileSync(path.resolve('fixtures', fixtureName, 'fixture.js')).toString();
  var expected = fs.readFileSync(path.resolve('fixtures', fixtureName, 'expected.js')).toString();
  var actual = babel.transform(fixture, {
    plugins: ['./index'],
    externalHelpers: true,
    optional: ['es7.decorators']
  }).code;
  assert.equal(actual + '\n', expected);
}

test('no-annotation');
test('normal-class');
test('export-named-class');
test('export-default-class');
