import {
  Component,
  View,
  Input,
  ViewMetadata
} from 'angular2/core';
import {
  AsyncTestCompleter,
  beforeEach,
  describe,
  expect,
  inject,
  it,
  TestComponentBuilder,
} from 'angular2/testing_internal';

describe('component', () => {
  it('works with class/prop/param decorators and type annotations', inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
    class Greeter {
      say(greeting, name) {
        return `${greeting}, ${name}!`;
      }
    }

    @Component({
      selector: 'hello-world',
      template: '<p>{{message}}</p>'
    })
    class HelloWorld {
      @Input() name;
      @Input() greeting;

      constructor(greeter: Greeter) {
        this.greeter = greeter;
      }

      ngOnInit() {
        this.message = this.greeter.say(this.greeting, this.name);
      }
    }

    @Component({
      selector: 'my-comp',
      directives: [HelloWorld],
      viewProviders: [Greeter],
      template: '<hello-world [greeting]="greeting" name="Babel"></hello-world>'
    })
    class MyComp {}

    tcb.createAsync(MyComp)
      .then((fixture) => {
        fixture.debugElement.componentInstance.greeting = 'Hello';

        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement).toHaveText('Hello, Babel!');
        async.done();
      })
      .catch((e) => console.error(e));
  }));
});
