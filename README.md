[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations/master.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

A babel transformer plugin for Angular 2 decorators and type annotations. **Parameter decorator is not supported because there's currently no way to extend Babel's parser.**

Use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) to support Babel-5-compatible decorators.

Make sure to load [reflect-metadata](https://github.com/rbuckton/ReflectDecorators) for browser in order to polyfill Metadata Reflection API in your app.

## Supported decorators/annotations

### Even without this plugin (thanks to [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy))

- Class decorators

  ```js
  @Component({ selector: 'hello' })
  class HelloComponent {}
  ```

- Class property decorators with initializers

  ```js
  @Component({ /* ... */ })
  class HelloComponent {
    @Output() foo = new EventEmitter();`
  }
  ```

### With this plugin

- Type annotations for constructor parameters

  ```js
  class Hello {
    constructor(foo: Foo, bar: Bar) {
      this.foo = foo;
      this.bar = bar;
    }
  }
  ```

  - Generic types are ignored as same as in TypeScript e.g. `QueryList<RouterLink>` is treated as `QueryList`

- Class property decorators with no initializer

  ```js
  @Component({ /* ... */ })
  class HelloComponent {
    @Input() bar;
  }
  ```

### Not supported

- Decorators for constructor parameters

  ```js
  @Component({ /* ... */ })
  class HelloComponent {
    constructor(@Attriute('name') name, @Optional() optional) {
      this.name = name;
      this.optional = optional;
    }
  }
  ```

  - It is inevitable because the parameter decorator syntax is not in [the ES7 proposals](https://github.com/tc39/ecma262) or implemented by Babel's parser.
  - This plugin used to support it by monkey-patching but [now it is forbidden to do so](https://github.com/babel/babel/pull/3204).
  - You can still directly use parameter decorator metadata to achieve the same functionalities.

    ```js
    @Component({ /* ... */ })
    @Reflect.metadata('parameters', [[new AttributeMetadata()], [new OptionalMetadata()]])
    class HelloComponent {
      constructor(name, optional) {
        this.name = name;
        this.optional = optional;
      }
    }
    ```

    More examples are in [the integration tests](test/integration/parameter-decorator-alternative.spec.js).

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

## License

[ISC](https://opensource.org/licenses/ISC)
