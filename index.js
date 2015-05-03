'use strict';

require('./patch');
var babel = require('babel-core');
var t = babel.types;
var Transformer = babel.Transformer;
var helper = require('babel-rtts-helper')('assert');

module.exports = new Transformer('angular2-at-annotation', {
  ClassDeclaration: function ClassDeclaration(node, parent, scope, file) {
    var defineAnnotations = extractClassAnnotations(node, file);
    var defineParameters = extractConstructorParameters(node, file);
    var defines = [defineAnnotations, defineParameters].filter(Boolean);
    if (defines.length === 0) {
      return undefined;
    }
    if (parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportDefaultDeclaration') {
      this.parentPath.replaceWithMultiple([parent].concat(defines));
    } else {
      return [node].concat(defines);
    }
  }
});

function extractClassAnnotations(node, file) {
  var classRef = node.id;
  var decorators = node.decorators;
  if (!decorators) {
    return undefined;
  }
  node.decorators = null;
  var annotations = t.arrayExpression(decorators.map(function (decorator) {
    var call = decorator.expression;
    return t.newExpression(call.callee, call.arguments);
  }));
  return t.expressionStatement(t.callExpression(
    file.addHelper('define-property'),
    [classRef, t.literal('annotations'), annotations]
  ));
}

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
    file.addHelper('define-property'),
    [classRef, t.literal('parameters'), arrays]
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
