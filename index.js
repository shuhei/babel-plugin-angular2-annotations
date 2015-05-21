'use strict';

var patch = require('./patch');
var createHelper = require('babel-rtts-helper');

module.exports = function (babel) {
  patch(babel);
  var t = babel.types;
  var Transformer = babel.Transformer;
  var helper = createHelper(babel, 'assert');

  return new Transformer('angular2-annotations', {
    ClassDeclaration: function ClassDeclaration(node, parent) {
      var classRef = node.id;
      var classBody = node.body.body;

      // Create additional statements for parameter decorators and types.
      var decorators;
      var types;
      classBody.forEach(function (bodyNode) {
        if (bodyNode.type === 'MethodDefinition' && bodyNode.kind === 'constructor') {
          decorators = parameterDecorators(bodyNode.value.params, classRef);
          types = parameterTypes(bodyNode.value.params, classRef);
        }
      });
      var additionalStatements = [].concat(decorators, types).filter(Boolean);

      // If not found, do nothing.
      if (additionalStatements.length === 0) {
        return undefined;
      }

      // Append additional statements to program.
      if (parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportDefaultDeclaration') {
        // The class declaration is wrapped by an export declaration.
        this.parentPath.replaceWithMultiple([parent].concat(additionalStatements));
      } else {
        return [node].concat(additionalStatements);
      }
    }
  });

  // Returns an array of parameter decorator call statements for a class.
  function parameterDecorators(params, classRef) {
    var decoratorLists = params.map(function (param, i) {
      var decorators = param.decorators;
      if (!decorators) {
        return [];
      }
      // Delete parameter decorators because they are invalid in vanilla babel.
      // They might be just ignored though.
      param.decorators = null;

      return decorators.map(function (decorator) {
        var call = decorator.expression;
        var args = [classRef, t.identifier('null'), t.identifier(i)];
        return t.expressionStatement(t.callExpression(call, args));
      });
    });
    // Flatten.
    return Array.prototype.concat.apply([], decoratorLists);
  }

  // Returns an array of define 'parameters' metadata statements for a class.
  // The array may contain zero or one statements.
  function parameterTypes(params, classRef) {
    var types = params.map(function (param) {
      var annotation = param.typeAnnotation && param.typeAnnotation.typeAnnotation;
      if (!annotation) {
        return null;
      }
      return helper.typeForAnnotation(annotation);
    });
    if (!types.some(Boolean)) {
      return [];
    }
    return [defineMetadata('design:paramtypes', t.arrayExpression(types), classRef)];
  }

  // Returns an AST for define metadata statement.
  function defineMetadata(key, value, target) {
    return t.expressionStatement(t.callExpression(
      t.memberExpression(t.identifier('Reflect'), t.identifier('defineMetadata')),
      [t.literal(key), value, target]
    ));
  }
};
