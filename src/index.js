import generate from 'babel-generator';

const TAG = '[babel-plugin-angular2-annotations]';

export default function ({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(path) {
        const node = path.node;
        const classRef = node.id;
        const classBody = node.body.body;

        // Create additional statements for types annotations.
        let types = [];
        classBody.forEach((bodyNode) => {
          if (bodyNode.type === 'ClassMethod' && bodyNode.kind === 'constructor') {
            types = parameterTypes(bodyNode.params, classRef);
          } else if (bodyNode.type === 'ClassProperty' && bodyNode.value === null && !bodyNode.static) {
            // Handle class property without initializer.
            // https://github.com/jeffmo/es-class-fields-and-static-properties
            bodyNode.value = t.memberExpression(t.thisExpression(), bodyNode.key);
          }
        });
        const additionalStatements = types.filter(Boolean);

        // If not found, do nothing.
        if (additionalStatements.length === 0) {
          return undefined;
        }

        // Append additional statements to program.
        const parent = path.parent;
        if (parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportDefaultDeclaration') {
          // The class declaration is wrapped by an export declaration.
          path.parentPath.insertAfter(additionalStatements);
        } else {
          path.insertAfter(additionalStatements);
        }
      }
    }
  };

  // Returns an array of define 'parameters' metadata statements for a class.
  // The array may contain zero or one statements.
  function parameterTypes(params, classRef) {
    const types = params.map((param) => {
      const annotation = param.typeAnnotation && param.typeAnnotation.typeAnnotation;
      return typeForAnnotation(annotation);
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
      [t.stringLiteral(key), value, target]
    ));
  }

  function typeForAnnotation(annotation) {
    if (!annotation) {
      return null;
    }
    switch (annotation.type) {
      case 'StringTypeAnnotation':
        return t.identifier('String');
      case 'NumberTypeAnnotation':
        return t.identifier('Number');
      case 'BooleanTypeAnnotation':
        return t.identifier('Boolean');
      case 'VoidTypeAnnotation':
        return t.unaryExpression('void', t.numericLiteral(0));
      case 'GenericTypeAnnotation':
        if (annotation.typeParameters) {
          const genericCode = generate(annotation).code;
          const plainCode = generate(annotation.id).code;
          console.warn(`${TAG} Generic type is not supported: ${genericCode} Just use: ${plainCode}`);
        }
        return annotation.id;
      case 'ObjectTypeAnnotation':
        return t.identifier('Object');
      case 'FunctionTypeAnnotation':
        return t.identifier('Function');
      default:
        return null;
    }
  }
}
