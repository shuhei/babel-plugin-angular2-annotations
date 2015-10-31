export default function patch() {
  let Parser;
  let tt;
  try {
    Parser = require('babylon/lib/parser').default;
    tt = require('babylon/lib/tokenizer/types').types;
  } catch(e) {
    console.error('Install `babylon` as a top-level package.');
    throw e;
  }

  // HACK: Monkey patching to parse parameter decorators.
  // Based on the compiled output of babel-core 6.0.14.
  Parser.prototype.parseBindingList = function (close, allowEmpty, allowTrailingComma) {
    let elts = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
      }
      if (allowEmpty && this.match(tt.comma)) {
        elts.push(null);
      } else if (allowTrailingComma && this.eat(close)) {
        break;
      } else if (this.match(tt.ellipsis)) {
        elts.push(this.parseAssignableListItemTypes(this.parseRest()));
        this.expect(close);
        break;
      } else {
        // Start monkey patching
        const decorators = [];
        while (this.match(tt.at)) {
          decorators.push(this.parseDecorator());
        }
        // End monkey patching
        let left = this.parseMaybeDefault();
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
}
