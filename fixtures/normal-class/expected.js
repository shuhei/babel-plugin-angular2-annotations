"use strict";

var HelloComponent = function HelloComponent(foo, bar) {
  babelHelpers.classCallCheck(this, HelloComponent);
};

Yes({ key: "value" })(HelloComponent, null, 0);
No()(HelloComponent, null, 0);
Reflect.defineMetadata("design:paramtypes", [Foo, Bar], HelloComponent);
