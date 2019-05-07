export class Import {
  private _default: boolean;
  private _imports: [string, string | undefined][] = [];
  private _from: string;

  get Imports() {
    return this._imports as ReadonlyArray<ReadonlyArray<string>>;
  }

  get From() {
    return this._from;
  }

  SetImport(importString: string, asImport?: string) {
    this._imports.push([importString, asImport]);
    return this;
  }

  SetFrom(from: string) {
    this._from = from;
    return this;
  }
}
