export class HelloComponent {
  constructor(@Yes({ key: "value" }) @No() foo: Foo, bar: Bar) {
  }
}
