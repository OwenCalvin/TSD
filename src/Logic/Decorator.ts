import { Named } from "./Named";

export class Decorator extends Named {
  private _arguments: any[] = [];

  get Arguments() {
    return this._arguments as ReadonlyArray<any>;
  }

  AddArgument(...args: any[]) {
    return this.addToArray(this._arguments, ...args);
  }

  RemoveArgument(argument) {
    const foundArgIndex = this._arguments.findIndex((arg) => argument === arg);
    this._arguments.splice(foundArgIndex, 1);
    return this;
  }
}
