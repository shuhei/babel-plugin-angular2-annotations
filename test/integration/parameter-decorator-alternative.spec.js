import {
  Injector, Injectable, provide,
  Component,
  AttributeMetadata, QueryMetadata, ViewQueryMetadata,
  InjectMetadata, OptionalMetadata, SelfMetadata, SkipSelfMetadata, HostMetadata
} from 'angular2/core';
import {
  AsyncTestCompleter,
  beforeEach,
  describe,
  expect,
  inject,
  it,
  xit,
  TestComponentBuilder,
} from 'angular2/testing_internal';

describe('parameter decorator alternatives', () => {
  describe('Directive DI', () => {
    xit('works as @Attribute', inject([], () => {
    }));

    xit('works as @Query', inject([], () => {
    }));

    xit('works as @ViewQuery', inject([], () => {
    }));

    xit('works as @Host', inject([], () => {
    }));
  });

  describe('Pure DI', () => {
    it('works as @Inject', () => {
      class Engine {}

      @Injectable()
      @Reflect.metadata('parameters', [[new InjectMetadata('MyEngine')]])
      class Car {
        constructor(engine: Engine) {
          this.engine = engine;
        }
      }

      const injector = Injector.resolveAndCreate([
        provide('MyEngine', { useClass: Engine }),
        Car
      ]);

      expect(injector.get(Car).engine instanceof Engine).toBe(true);
    });

    it('works as @Optional', inject([], () => {
      class Engine {}

      @Injectable()
      @Reflect.metadata('parameters', [[new OptionalMetadata()]])
      class Car {
        constructor(engine: Engine) {
          this.engine = engine;
        }
      }

      const injector = Injector.resolveAndCreate([Car]);

      expect(injector.get(Car).engine).toBeNull();
    }));

    it('works as @Self', inject([], () => {
      class Dependency {}

      @Injectable()
      @Reflect.metadata('parameters', [[new SelfMetadata()]])
      class NeedsDependency {
        constructor(dependency: Dependency) {
          this.dependency = dependency;
        }
      }

      const injector = Injector.resolveAndCreate([Dependency, NeedsDependency]);
      expect(injector.get(NeedsDependency).dependency instanceof Dependency).toBe(true);

      const parent= Injector.resolveAndCreate([Dependency]);
      const child= parent.resolveAndCreateChild([NeedsDependency]);
      expect(() => child.get(NeedsDependency)).toThrowError();
    }));

    it('works as @SkipSelf', inject([], () => {
      class Dependency {}

      @Injectable()
      @Reflect.metadata('parameters', [[new SkipSelfMetadata()]])
      class NeedsDependency {
        constructor(dependency: Dependency) {
          this.dependency = dependency;
        }
      }

      const injector = Injector.resolveAndCreate([Dependency, NeedsDependency]);
      expect(() => injector.get(NeedsDependency)).toThrowError();

      const parent= Injector.resolveAndCreate([Dependency]);
      const child= parent.resolveAndCreateChild([NeedsDependency]);
      expect(child.get(NeedsDependency).dependency instanceof Dependency).toBe(true);
    }));
  });
});
