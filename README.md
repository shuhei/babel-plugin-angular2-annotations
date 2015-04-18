[![build status](https://img.shields.io/travis/shuhei/babel-plugin-angular2-at-annotation.svg)](https://travis-ci.org/shuhei/babel-plugin-angular2-at-annotation)
[![npm version](https://img.shields.io/npm/v/babel-plugin-angular2-at-annotation.svg)](https://www.npmjs.org/package/babel-plugin-angular2-at-annotation)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-angular2-at-annotation.svg)](https://www.npmjs.org/package/babel-plugin-angular2-at-annotation)

# babel-plugin-angular2-at-annotation

An **experimental** babel transformer plugin for Angular 2 @ annotation.

Use with `--optional es7.decorators`.

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
```

See [babel-angular2-app](https://github.com/shuhei/babel-angular2-app) for more complete example.
