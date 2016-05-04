@Component({ selector: "hello" })
export default class HelloComponent {
  constructor(@Yes({ key: "value" }) @No() foo: Foo, bar: Bar) {
  }
}
