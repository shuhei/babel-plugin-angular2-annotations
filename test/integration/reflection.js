import test from 'tape';
import 'reflect-metadata';
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
} from 'angular2/core';

test('Class decorator', (t) => {
  @Component({
    selector: 'hello-world'
  })
  class HelloWorld {
  }

  t.deepEqual(reflector.annotations(HelloWorld), [
    new ComponentMetadata({ selector: 'hello-world' })
  ]);

  t.end();
});

test('Class property decorator', (t) => {
  class HelloWorld {
    @Input() name;
    @Output('g') greetings = new EventEmitter();
  }

  t.deepEqual(reflector.propMetadata(HelloWorld), {
    name: [new InputMetadata()],
    greetings: [new OutputMetadata('g')]
  });

  t.end();
});

test('Constructor parameter decorator', (t) => {
  class HelloWorld {
    constructor(@Attribute('g') greeting, @Attribute() name) {
      this.greeting = greeting;
      this.name = name;
    }
  }

  t.deepEqual(reflector.parameters(HelloWorld), [
    [new AttributeMetadata('g')],
    [new AttributeMetadata()]
  ]);

  t.end();
});

test('Constructor parameter type annotation', (t) => {
  class Greeter {
  }

  class HelloWorld {
    constructor(greeter: Greeter, something, anotherGreeter: Greeter) {
    }
  }

  t.deepEqual(reflector.parameters(HelloWorld), [
    [Greeter],
    [undefined],
    [Greeter]
  ]);

  t.end();
});

test('All in one', (t) => {
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

  t.deepEqual(reflector.propMetadata(HelloWorld), {
    foo: [new InputMetadata()],
    greetings: [new OutputMetadata('g')]
  }, 'propMetadata');
  t.deepEqual(reflector.annotations(HelloWorld), [
    new ComponentMetadata({ selector: 'hello-world' })
  ], 'annotations');
  t.deepEqual(reflector.parameters(HelloWorld), [
    [Greeter],
    [undefined, new AttributeMetadata('n')],
    [Greeter]
  ], 'parameters');

  t.end();
});
