[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations/master.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

A babel transformer plugin for Angular 2 decorators and type annotations. **Parameter decorators are not supported.**

Use `babel-plugin-transform-decorators-legacy` to support Babel-5-compatible decorators.

Make sure to load [reflect-metadata](https://github.com/rbuckton/ReflectDecorators) for browser in order to polyfill Metadata Reflection API in your app.

**Parameter decorator support will be dropped soon because [Babel has forbidden monkey-patching its parser](https://github.com/babel/babel/pull/3204).**

## Supported decorators/annotations

### Even without this plugin

- Class decorators e.g. `@Component() class Foo {}`
- Class property decorators with initializers e.g. `@Output() foo = new EventEmitter();`

### With this plugin

- Type annotations for constructor parameters e.g. `constructor(foo: Foo, bar: Bar) {}`
  - Generic types are ignored as same as in TypeScript e.g. `QueryList<RouterLink>` is treated as `QueryList`
- Class property decorators with no initializer e.g. `@Input() bar;`

### Not supported

- Decorators for constructor parameters e.g. `constructor(@Attriute('name') name, @Parent() parent) {}`
  - It is inevitable because the parameter decorator syntax is not in [the ES7 proposals](https://github.com/tc39/ecma262) or implemented by Babel's parser.
  - This plugin used to support it by monkey-patching but [now it is forbidden to do so](https://github.com/babel/babel/pull/3204).

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

## Example

Before:

```js
class HelloComponent {
  @Input() baz;
  constructor(foo: Foo, bar: Bar) {
  }
}
```

After:

```js
class HelloComponent {
  @Input() baz = this.baz;
}

Reflect.defineMetadata('design:paramtypes', [Foo, Bar]);
```

See [babel-angular2-app](https://github.com/shuhei/babel-angular2-app) for more complete example.
