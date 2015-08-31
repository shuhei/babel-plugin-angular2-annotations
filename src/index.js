import rttsHelper from 'babel-rtts-helper';
import patch from './patch';

patch();

export default function ({ Plugin, types: t }) {
  const helper = rttsHelper({ types: t }, 'assert');

  return new Plugin('angular2-annotations', {
    visitor: {
      ClassDeclaration(node, parent) {
        const classRef = node.id;
        const classBody = node.body.body;

        // Create additional statements for parameter decorators and types.
        let decorators;
        let types;
        classBody.forEach((bodyNode) => {
          if (bodyNode.type === 'MethodDefinition' && bodyNode.kind === 'constructor') {
            decorators = parameterDecorators(bodyNode.value.params, classRef);
            types = parameterTypes(bodyNode.value.params, classRef);
          }
        });
        const additionalStatements = [].concat(decorators, types).filter(Boolean);

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
    const decoratorLists = params.map((param, i) => {
      const decorators = param.decorators;
      if (!decorators) {
        return [];
      }
      // Delete parameter decorators because they are invalid in vanilla babel.
      // They might be just ignored though.
      param.decorators = null;

      return decorators.map((decorator) => {
        const call = decorator.expression;
        const args = [classRef, t.identifier('null'), t.identifier(i)];
        return t.expressionStatement(t.callExpression(call, args));
      });
    });
    // Flatten.
    return Array.prototype.concat.apply([], decoratorLists);
  }

  // Returns an array of define 'parameters' metadata statements for a class.
  // The array may contain zero or one statements.
  function parameterTypes(params, classRef) {
    const types = params.map((param) => {
      const annotation = param.typeAnnotation && param.typeAnnotation.typeAnnotation;
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
}
