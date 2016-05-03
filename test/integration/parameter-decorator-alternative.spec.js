import {
  ReflectiveInjector, Injectable, provide,
  Component, Directive,
  QueryList,
  AttributeMetadata, QueryMetadata, ViewQueryMetadata,
  InjectMetadata, OptionalMetadata, SelfMetadata, SkipSelfMetadata, HostMetadata,
  PLATFORM_DIRECTIVES
} from '@angular/core';
import {
  NgFor
} from '@angular/common';
import {
  beforeEach,
  describe,
  expect,
  inject,
  it,
  xit,
  async
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

describe('parameter decorator alternatives', () => {
  describe('Directive DI', () => {
    it('works as @Attribute', async(inject([TestComponentBuilder], (tcb) => {
      @Component({
        selector: 'foo',
        template: '{{bar}}'
      })
      @Reflect.metadata('parameters', [[new AttributeMetadata('bar')]])
      class Foo {
        constructor(barProp) {
          this.bar = barProp;
        }
      }

      @Component({
        selector: 'my-comp',
        directives: [Foo],
        template: '<foo bar="baz"></foo>'
      })
      class MyComp {}

      tcb.createAsync(MyComp)
        .then((fixture) => {
          const foo = fixture.debugElement.children[0].componentInstance;
          expect(foo.bar).toEqual('baz');
        });
    })));

    it('works as @Query', async(inject([TestComponentBuilder], (tcb) => {
      @Component({
        selector: 'pane',
        inputs: ['title'],
        template: `
          <div><ng-content></ng-content></div>
        `
      })
      class Pane {}

      @Component({
        selector: 'tabs',
        directives: [NgFor],
        template: `
          <ul>
            <li *ngFor="let pane of panes">{{pane.title}}</li>
          </ul>
          <ng-content></ng-content>
        `
      })
      @Reflect.metadata('parameters', [[new QueryMetadata(Pane)]])
      class Tabs {
        constructor(panes: QueryList) {
          this.panes = panes;
        }
      }

      @Component({
        selector: 'my-comp',
        directives: [Pane, Tabs, NgFor],
        template: `
          <tabs>
            <pane title="Overview">...</pane>
            <pane *ngFor="let o of objects" [title]="o.title">{{o.text}}</pane>
          </tabs>
        `
      })
      class MyComp {
        objects = [
          { title: 'foo', text: 'Foo!' },
          { title: 'bar', text: 'Bar!' },
          { title: 'baz', text: 'Baz!' }
        ];
      }

      tcb.createAsync(MyComp)
        .then((fixture) => {
          fixture.detectChanges();

          const tabs = fixture.debugElement.children[0];
          const listItems = tabs.nativeElement.querySelectorAll('li');
          expect([...listItems].map((l) => l.textContent)).toEqual(['Overview', 'foo', 'bar', 'baz']);
          const panes = tabs.nativeElement.querySelectorAll('div');
          expect([...panes].map((p) => p.textContent)).toEqual(['...', 'Foo!', 'Bar!', 'Baz!']);
        });
    })));

    it('works as @ViewQuery', async(inject([TestComponentBuilder], (tcb) => {
      @Component({
        selector: 'item',
        template: '<ng-content></ng-content>'
      })
      class Item {}

      @Component({
        selector: 'my-comp',
        directives: [Item],
        template: `
          <item>a</item>
          <item>b</item>
          <item>c</item>
        `
      })
      @Reflect.metadata('parameters', [[new ViewQueryMetadata(Item)]])
      class MyComponent {
        constructor(items: QueryList) {
          this.items = items;
        }
      }

      tcb.createAsync(MyComponent)
        .then((fixture) => {
          const items = fixture.componentInstance.items;
          items.changes.subscribe(() => {
            expect(items.length).toEqual(3);
          });

          fixture.detectChanges();
        });
    })));

    it('works as @Host', async(inject([TestComponentBuilder], (tcb) => {
      class OtherService {}
      class HostService {}

      @Component({
        selector: 'child-directive',
        template: 'child'
      })
      @Reflect.metadata('parameters', [
        [new OptionalMetadata(), new HostMetadata()],
        [new OptionalMetadata(), new HostMetadata()]
      ])
      class ChildDirective {
        constructor(os: OtherService, hs: HostService) {
          this.os = os;
          this.hs = hs;
        }
      }

      @Component({
        selector: 'parent-cmp',
        viewProviders: [HostService],
        template: 'Dir: <child-directive></child-directive>',
        directives: [ChildDirective]
      })
      class ParentCmp {}

      @Component({
        selector: 'app',
        viewProviders: [OtherService],
        template: `
          Parent: <parent-cmp></parent-cmp>
        `,
        directives: [ParentCmp]
      })
      class App {}

      tcb.createAsync(App)
        .then((fixture) => {
          fixture.detectChanges();

          const parent = fixture.debugElement.children[0];
          const childInstance = parent.children[0].componentInstance;
          expect(childInstance.os).toBeNull();
          expect(childInstance.hs).toBeAnInstanceOf(HostService);
        });
    })));
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

      const injector = ReflectiveInjector.resolveAndCreate([
        provide('MyEngine', { useClass: Engine }),
        Car
      ]);

      expect(injector.get(Car).engine).toBeAnInstanceOf(Engine);
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

      const injector = ReflectiveInjector.resolveAndCreate([Car]);

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

      const injector = ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
      expect(injector.get(NeedsDependency).dependency).toBeAnInstanceOf(Dependency);

      const parent= ReflectiveInjector.resolveAndCreate([Dependency]);
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

      const injector = ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
      expect(() => injector.get(NeedsDependency)).toThrowError();

      const parent= ReflectiveInjector.resolveAndCreate([Dependency]);
      const child= parent.resolveAndCreateChild([NeedsDependency]);
      expect(child.get(NeedsDependency).dependency).toBeAnInstanceOf(Dependency);
    }));
  });
});
