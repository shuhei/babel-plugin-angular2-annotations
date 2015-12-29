[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations/master.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

A babel transformer plugin for Angular 2 annotations.

Use `babel-plugin-transform-decorators-legacy` to support Babel 5 decorators.

Make sure to load [reflect-metadata](https://github.com/rbuckton/ReflectDecorators) for browser in order to polyfill Metadata Reflection API in your app.

**Parameter decorator support will be dropped soon because [Babel has forbidden monkey-patching its parser](https://github.com/babel/babel/pull/3204).**

## Supported decorators/annotations

### Even without this plugin

- Class decorators e.g. `@Component() class Foo {}`
- Class property decorators e.g. `@Output() foo = new EventEmitter();`
  - Decorated class property with no initializer is supported by this plugin e.g. `@Input() bar;`

### With this plugin

- Type annotations for constructor parameters e.g. `constructor(foo: Foo, bar: Bar) {}`
  - Generic types are ignored as same as in TypeScript e.g. `QueryList<RouterLink>` is treated as `QueryList`
- Decorators for constructor parameters e.g. `constructor(@Attriute('name') name, @Parent() parent) {}`

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
