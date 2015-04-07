'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var HelloComponent = function HelloComponent() {
  _classCallCheck(this, HelloComponent);
};

exports.HelloComponent = HelloComponent;
HelloComponent.annotations = [new Component({
  selector: 'hello'
}), new Template({
  inline: '<p>Hello, {{name}}!</p>'
})];
