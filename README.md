[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations/master.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

A babel transformer plugin for Angular 2 annotations.

Use `babel-plugin-transform-decorators-legacy` to support Babel 5 decorators.

Make sure to load [reflect-metadata](https://github.com/rbuckton/ReflectDecorators) for browser in order to polyfill Metadata Reflection API in your app.

## Install

```sh
npm install --save-dev babel-plugin-angular2-annotations
```

```sh
npm install --save-dev babel-plugin-transform-decorators-legacy babel-plugin-transform-class-properties babel-plugin-transform-flow-strip-types babel-preset-es2015
```

.babelrc

```json
{
  "plugins": [
    "angular2-annotations",
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-flow-strip-types"
  ],
  "presets": [
    "es2015"
  ]
}
```

### npm 3

That's it.

### npm 2

To monkey-patch `babylon`, the parser of `babel`, should be installed **at the top level**. This is an ugly hack but inevitable to support parameter decorators, which is not currently supported by `babel`, by monkey-patching.

```
npm install --save-dev babylon
```

## Supported annotations

- Class decorators (`@Component()`): works without this plugin
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
