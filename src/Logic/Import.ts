export class Import {
  private _default?: string;
  private _imports: [string, string | undefined][] = [];
  private _from: string;

  get Imports() {
    return this._imports as ReadonlyArray<ReadonlyArray<string>>;
  }

  get From() {
    return this._from;
  }

  get Default() {
    return this._default;
  }

  AddImport(importString: string, asImport?: string) {
    this._imports.push([importString, asImport]);
    return this;
  }

  SetDefault(importAs: string) {
    if (importAs) {
      this._default = importAs;
    }
    return this;
  }

  SetFrom(from: string) {
    this._from = from;
    return this;
  }
}
