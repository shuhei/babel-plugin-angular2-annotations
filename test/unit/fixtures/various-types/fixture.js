@Component({ selector: "hello" })
class HelloComponent {
  constructor(
    str: string,
    num: number,
    bool: boolean,
    voi: void,
    obj: Object,
    objProps: { foo: string, bar: number },
    func: (foo: string) => number,
    @Query(RouterLink) routerLinks: QueryList<RouterLink>
  ) {
  }
}
