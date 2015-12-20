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

  t.deepEqual(Reflect.getMetadataKeys(HelloWorld), ['annotations']);
  t.deepEqual(Reflect.getMetadata('annotations', HelloWorld), [
    new ComponentMetadata({ selector: 'hello-world' })
  ]);

  t.end();
});

test('Class property decorator', (t) => {
  class HelloWorld {
    @Input() name;
    @Output('g') greetings = new EventEmitter();
  }

  t.deepEqual(Reflect.getMetadataKeys(HelloWorld), ['propMetadata']);
  t.deepEqual(Reflect.getMetadata('propMetadata', HelloWorld), {
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

  t.deepEqual(Reflect.getMetadataKeys(HelloWorld), ['parameters']);
  t.deepEqual(Reflect.getMetadata('parameters', HelloWorld), [
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

  t.deepEqual(Reflect.getMetadataKeys(HelloWorld), ['design:paramtypes']);
  t.deepEqual(Reflect.getMetadata('design:paramtypes', HelloWorld), [
    Greeter,
    ,
    Greeter
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

  t.deepEqual(Reflect.getMetadataKeys(HelloWorld), [
    'propMetadata',
    'annotations',
    'parameters',
    'design:paramtypes'
  ]);
  t.deepEqual(Reflect.getMetadata('propMetadata', HelloWorld), {
    foo: [new InputMetadata()],
    greetings: [new OutputMetadata('g')]
  }, 'propMetadata');
  t.deepEqual(Reflect.getMetadata('annotations', HelloWorld), [
    new ComponentMetadata({ selector: 'hello-world' })
  ], 'annotations');
  t.deepEqual(Reflect.getMetadata('parameters', HelloWorld), [
    null,
    [new AttributeMetadata('n')],
  ], 'parameters');
  t.deepEqual(Reflect.getMetadata('design:paramtypes', HelloWorld), [
    Greeter,
    ,
    Greeter
  ], 'design:paramtypes');

  t.end();
});
