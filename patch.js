var babel = require('babel-core');
var tt = babel.acorn.tokTypes;

// HACK: Monkey patching to parse parameter decorators. Based on babel-core 5.1.10.
babel.acorn.Parser.prototype.parseBindingList = function (close, allowEmpty, allowTrailingComma) {
  var elts = [],
      first = true;
  while (!this.eat(close)) {
    if (first) first = false;else this.expect(tt.comma);
    if (allowEmpty && this.type === tt.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === tt.ellipsis) {
      elts.push(this.parseAssignableListItemTypes(this.parseRest()));
      this.expect(close);
      break;
    } else {
      // Start monkey patching
      var decorators = [];
      while (this.type === tt.at) {
        decorators.push(this.parseDecorator());
      }
      // End monkey patching
      var left = this.parseMaybeDefault();
      // Start monkey patching
      if (decorators.length > 0) {
        left.decorators = decorators;
        decorators = [];
      }
      // End monkey patching
      this.parseAssignableListItemTypes(left);
      elts.push(this.parseMaybeDefault(null, left));
    }
  }
  return elts;
};
