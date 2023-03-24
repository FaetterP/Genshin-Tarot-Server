export class Event<T> {
  private functions: ((arg: T) => void)[] = [];

  public Invoke(arg: T): void {
    for (const fun of this.functions) {
      fun(arg);
    }
  }

  public AddListener(fn: (arg: T) => void) {
    this.functions.push(fn);
  }

  public RemoveListener(fn: (arg: T) => void) {
    this.functions.filter((item) => item !== fn);
  }
}
