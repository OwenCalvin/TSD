import { IImport } from "..";
import { Named } from "./Named";

export class Import extends Named implements IImport {
  private _default?: string;
  private _imports: [string, string | undefined][] = [];

  get Imports() {
    return this._imports as ReadonlyArray<[string, string | undefined]>;
  }

  get Default() {
    return this._default;
  }

  ToObject(): IImport {
    return {
      Default: this.Default,
      Name: this.Name,
      Imports: this.Imports
    };
  }

  ParseObject(obj: Import) {
    this
      .SetDefault(obj.Default)
      .SetName(obj.Name)
      .AddImport(...obj.Imports);
  }

  AddImport(...importInfos: [string, string?][]) {
    return this.addToArray(this._imports, ...importInfos);
  }

  SetDefault(importAs: string) {
    if (importAs) {
      this._default = importAs;
    }
    return this;
  }
}
