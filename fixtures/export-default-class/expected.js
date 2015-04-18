'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var HelloComponent = function HelloComponent() {
  babelHelpers.classCallCheck(this, HelloComponent);
};

exports['default'] = HelloComponent;
babelHelpers.defineProperty(HelloComponent, 'annotations', [new Component({
  selector: 'hello'
}), new Template({
  inline: '<p>Hello, {{name}}!</p>'
})]);
module.exports = exports['default'];
