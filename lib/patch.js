'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patch;

function patch() {
  var Parser = undefined;
  var tt = undefined;
  try {
    Parser = require('babylon/lib/parser')['default'];
    tt = require('babylon/lib/tokenizer/types');
  } catch (e) {
    console.error('Install `babylon` as a top-level package.');
    throw e;
  }

  /* eslint-disable */
  // HACK: Monkey patching to parse parameter decorators. Based on the compiled output of babel-core 5.8.23.
  function parseBindingList(close, allowEmpty, allowTrailingComma) {
    var elts = [],
        first = true;
    while (!this.eat(close)) {
      if (first) first = false;else this.expect(tt.types.comma);
      if (allowEmpty && this.match(tt.types.comma)) {
        elts.push(null);
      } else if (allowTrailingComma && this.eat(close)) {
        break;
      } else if (this.match(tt.types.ellipsis)) {
        elts.push(this.parseAssignableListItemTypes(this.parseRest()));
        this.expect(close);
        break;
      } else {
        // Start monkey patching
        var decorators = [];
        while (this.match(tt.types.at)) {
          decorators.push(this.parseDecorator());
        }
        // End monkey patching
        var left = this.parseMaybeDefault();
        // Start monkey patching
        if (decorators.length > 0) {
          left.decorators = decorators;
        }
        // End monkey patching
        this.parseAssignableListItemTypes(left);
        elts.push(this.parseMaybeDefault(null, null, left));
      }
    }
    return elts;
  };
  /* eslint-enable */

  Parser.prototype.parseBindingList = parseBindingList;
}

module.exports = exports['default'];