export abstract class Named {
  private _name: string;

  constructor(name?: string) {
    if (name) {
      this.SetName(name);
    }
  }

  get Name() {
    return this._name;
  }

  SetName(name: string) {
    this._name = name;
    return this;
  }

  protected removeFromArray(array: any[], element: any) {
    array.splice(
      array.indexOf(element),
      1
    );
    return this;
  }

  protected addToArray<Type>(array: Type[], ...elements: Type[]) {
    elements.map((element) => array.push(element));
    return this;
  }
}
