[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-annotations.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-annotations)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-annotations.svg)](https://www.npmjs.org/package/babel-plugin-angular2-annotations)

# babel-plugin-angular2-annotations

An **experimental** babel transformer plugin for Angular 2 annotations.

Use with `--optional es7.decorators`.

## Supported annotations

- @ annotation for class (`@Component()`)
- Type annotation for constructor parameters (`constructor(foo: Foo, bar: Bar) {}`)
- @ annotation for constructor parameters (`constructor(@Attriute('name') name, @Parent() parent) {}`)

## Example

Before:

```js
@Component({
  selector: 'hello'
})
@Template({
  inline: '<p>Hello, {{name}}!</p>'
})
class HelloComponent {
  constructor(@Something() foo: Foo, bar: Bar) {
  }
}
```

After:

```js
class HelloComponent {
}
Object.defineProperty(HelloComponent, 'annotations', { get: function () {
  return [new Component({
    selector: 'hello'
  }), new Template({
    inline: '<p>Hello, {{name}}!</p>'
  })];
}});
Object.defineProperty(HelloComponent, 'parameters', { get: function () {
  return [[Foo, new Something()], [Bar]];
}});
```

See [babel-angular2-app](https://github.com/shuhei/babel-angular2-app) for more complete example.
