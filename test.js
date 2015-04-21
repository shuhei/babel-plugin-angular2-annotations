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
    optional: ["es7.decorators"]
  }).code;
  assert.equal(actual + '\n', expected);
}

test('annotations/normal-class');
test('annotations/export-named-class');
test('annotations/export-default-class');
test('parameters/normal-class');
test('parameters/export-named-class');
test('parameters/export-default-class');
