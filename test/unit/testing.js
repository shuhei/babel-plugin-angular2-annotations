var assert = require('assert');

module.exports = {
  test: test,
  printResult: printResult
};

function test(name, body) {
  try {
    body();
    console.log('OK', name);

    return true;
  } catch (e) {
    console.log('NG', name);
    if (e instanceof assert.AssertionError) {
      console.error('    Expected');
      console.error(indent(8, e.expected));
      console.error('    Actual');
      console.error(indent(8, e.actual));
    } else {
      console.error(indent(4, e.stack));
    }

    return false;
  }
}

function indent(level, text) {
  var spaces = '';
  while (level-- > 0) {
    spaces += ' ';
  }
  var lines = text.split('\n');
  var indented = lines.map(function (line) { return spaces + line; });
  return indented.join('\n');
}

function printResult(results) {
  var okCount = results.filter(Boolean).length;
  var ngCount = results.length - okCount;

  console.log();
  console.log('Done: %d OK, %d NG, %d Total', okCount, ngCount, results.length);
}
