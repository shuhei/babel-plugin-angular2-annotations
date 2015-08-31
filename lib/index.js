'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _babelRttsHelper = require('babel-rtts-helper');

var _babelRttsHelper2 = _interopRequireDefault(_babelRttsHelper);

var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

(0, _patch2['default'])();

exports['default'] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  var helper = (0, _babelRttsHelper2['default'])({ types: t }, 'assert');

  return new Plugin('angular2-annotations', {
    visitor: {
      ClassDeclaration: function ClassDeclaration(node, parent) {
        var classRef = node.id;
        var classBody = node.body.body;

        // Create additional statements for parameter decorators and types.
        var decorators = undefined;
        var types = undefined;
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
    return t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('Reflect'), t.identifier('defineMetadata')), [t.literal(key), value, target]));
  }
};

module.exports = exports['default'];