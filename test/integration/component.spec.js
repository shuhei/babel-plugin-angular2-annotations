import {
  Component,
  View,
  Input,
  Attribute,
  ViewMetadata
} from '@angular/core';
import {
  beforeEach,
  describe,
  expect,
  inject,
  it,
  async
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing'

describe('component', () => {
  it('works with class/prop/param decorators and type annotations', async(inject([TestComponentBuilder], (tcb) => {
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
      @Input() greeting;

      constructor(@Attribute('name') name, greeter: Greeter) {
        this.name = name;
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
      });
  })));
});
