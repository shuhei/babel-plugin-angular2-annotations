'use strict';

var HelloComponent = function HelloComponent() {
  babelHelpers.classCallCheck(this, HelloComponent);
};

babelHelpers.defineProperty(HelloComponent, 'annotations', [new Component({
  selector: 'hello'
}), new Template({
  inline: '<p>Hello, {{name}}!</p>'
})]);
