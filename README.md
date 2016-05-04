[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations/master.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

A babel transformer plugin for Angular 2 decorators and type annotations.

Use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) to support decorators.

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

- Decorators for constructor parameters

  ```js
  @Component({ /* ... */ })
  class HelloComponent {
    constructor(@Attribute('name') name, @Optional() optional) {
      this.name = name;
      this.optional = optional;
    }
  }
  ```

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
  constructor(foo: Foo, @Optional() bar: Bar) {
  }
}
```

After:

```js
class HelloComponent {
  @Input() baz = this.baz;
}

Optional()(HelloComponent, null, 1);
Reflect.defineMetadata('design:paramtypes', [Foo, Bar]);
```

See [babel-angular2-app](https://github.com/shuhei/babel-angular2-app) or [angular2-esnext-starter](https://github.com/blacksonic/angular2-esnext-starter) for more complete example.

## License

[ISC](https://opensource.org/licenses/ISC)
