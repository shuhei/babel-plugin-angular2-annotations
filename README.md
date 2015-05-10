[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

An **experimental** babel transformer plugin for Angular 2 annotations.

Use with `--optional es7.decorators`.

Make sure to load [reflect-metadata](https://github.com/rbuckton/ReflectDecorators) for browser in order to polyfill Metadata Reflection API in your app.

## Supported annotations

- ~~@ annotations for class (`@Component()`)~~  (As of angular 2 alpha.22, @ annotations are decorators)
- Type annotations for constructor parameters (`constructor(foo: Foo, bar: Bar) {}`)
- Decorators for constructor parameters (`constructor(@Attriute('name') name, @Parent() parent) {}`)

## Example

Before:

```js
class HelloComponent {
  constructor(@Something({ hello: 'world' }) foo: Foo, bar: Bar) {
  }
}
```

After:

```js
class HelloComponent {
}

Something({ hello: 'world' })(HelloComponent, null, 0);
Reflect.defineMetadata('design:paramtypes', [Foo, Bar]);
```

See [babel-angular2-app](https://github.com/shuhei/babel-angular2-app) for more complete example.
