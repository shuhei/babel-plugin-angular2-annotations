var babel = require('babel-core');
var t = babel.types;
var Transformer = babel.Transformer;

module.exports = new Transformer('angular2-at-annotation', {
  ClassDeclaration: function ClassDeclaration(node, parent, scope, file) {
    var classRef = node.id;
    var decorators = node.decorators;
    if (decorators) {
      node.decorators = null;
      var annotations = t.arrayExpression(decorators.map(function (decorator) {
        var call = decorator.expression;
        return t.newExpression(call.callee, call.arguments);
      }));
      var defineProperty = t.expressionStatement(t.callExpression(
        file.addHelper('define-property'),
        [classRef, t.literal('annotations'), annotations]
      ));
      if (parent.type === 'ExportNamedDeclaration') {
        this.parentPath.replaceWithMultiple([parent, defineProperty]);
      } else {
        return [node, defineProperty];
      }
    }
  }
});
