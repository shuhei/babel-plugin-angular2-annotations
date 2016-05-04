import {
  describe,
  expect,
  it
} from '@angular/core/testing';

import {
  EventEmitter,
  Component,
  Attribute,
  Input,
  Output,
  ComponentMetadata,
  AttributeMetadata,
  InputMetadata,
  OutputMetadata,
  reflector
} from '@angular/core';

describe('reflection', () => {
  it('supports class decorator', () => {
    @Component({
      selector: 'hello-world'
    })
    class HelloWorld {
    }

    expect(reflector.annotations(HelloWorld)).toEqual([
      new ComponentMetadata({ selector: 'hello-world' })
    ]);
  });

  it('supports class property decorator', () => {
    class HelloWorld {
      @Input() name;
      @Output('g') greetings = new EventEmitter();
    }

    expect(reflector.propMetadata(HelloWorld)).toEqual({
      name: [new InputMetadata()],
      greetings: [new OutputMetadata('g')]
    });
  });

  it('supports constructor parameter decorator', () => {
    class HelloWorld {
      constructor(@Attribute('g') greeting, @Attribute() name) {
        this.greeting = greeting;
        this.name = name;
      }
    }

    expect(reflector.parameters(HelloWorld)).toEqual([
      [new AttributeMetadata('g')],
      [new AttributeMetadata()]
    ]);
  });

  it('supports constructor parameter type annotation', () => {
    class Greeter {
    }

    class HelloWorld {
      constructor(greeter: Greeter, something, anotherGreeter: Greeter) {
      }
    }

    expect(reflector.parameters(HelloWorld)).toEqual([
      [Greeter],
      [undefined],
      [Greeter]
    ]);
  });

  it('supports all-in-one component', () => {
    class Greeter {
    }

    @Component({
      selector: 'hello-world'
    })
    class HelloWorld {
      @Input() foo;
      @Output('g') greetings = new EventEmitter();

      constructor(greeter: Greeter, @Attribute('n') name, anotherGreeter: Greeter) {
      }
    }

    expect(reflector.propMetadata(HelloWorld)).toEqual({
      foo: [new InputMetadata()],
      greetings: [new OutputMetadata('g')]
    });
    expect(reflector.annotations(HelloWorld)).toEqual([
      new ComponentMetadata({ selector: 'hello-world' })
    ]);
    expect(reflector.parameters(HelloWorld)).toEqual([
      [Greeter],
      [undefined, new AttributeMetadata('n')],
      [Greeter]
    ]);
  });

  it('adds initializer to class property without initializer', () => {
    class Foo {
    }
    Foo.prototype.foo = 123;

    class Bar extends Foo {
      foo;
    }

    const bar = new Bar();
    Foo.prototype.foo = 234;

    expect(bar.foo).toEqual(123);

  });
});
