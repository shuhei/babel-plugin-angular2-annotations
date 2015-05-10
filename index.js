'use strict';

require('./patch');
var babel = require('babel-core');
var t = babel.types;
var Transformer = babel.Transformer;
var helper = require('babel-rtts-helper')('assert');

module.exports = new Transformer('angular2-at-annotation', {
  ClassDeclaration: function ClassDeclaration(node, parent, scope, file) {
    var defineParameters = extractConstructorParameters(node, file);
    if (!defineParameters) {
      return undefined;
    }
    if (parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportDefaultDeclaration') {
      this.parentPath.replaceWithMultiple([parent].concat(defineParameters));
    } else {
      return [node].concat(defineParameters);
    }
  }
});

function extractConstructorParameters(node, file) {
  var classRef = node.id;
  var classBody = node.body.body;
  var parameters;
  classBody.forEach(function (bodyNode) {
    if (bodyNode.type === 'MethodDefinition' && bodyNode.kind === 'constructor') {
      parameters = ignoreEmpty(parameterAnnotations(bodyNode.value.params));
    }
  });
  if (!parameters) {
    return undefined;
  }
  var arrays = t.arrayExpression(parameters.map(function (item) {
    return t.arrayExpression(item);
  }));
  return t.expressionStatement(t.callExpression(
    t.memberExpression(t.identifier('Reflect'), t.identifier('defineMetadata')),
    [t.literal('parameters'), arrays, classRef]
  ));
}

function parameterAnnotations(params) {
  return params.map(function (param) {
    var annotation = param.typeAnnotation && param.typeAnnotation.typeAnnotation;
    var decorators = param.decorators;
    var item = [];
    if (annotation) {
      item.push(helper.typeForAnnotation(annotation));
    }
    if (decorators) {
      param.decorators = null;
      var news = decorators.map(function (decorator) {
        var call = decorator.expression;
        return t.newExpression(call.callee, call.arguments);
      });
      item = item.concat(news);
    }
    return item;
  });
}

function ignoreEmpty(arrays) {
  var allEmpty = arrays.every(function (array) {
    return array.length === 0;
  });
  return allEmpty ? null : arrays;
}
