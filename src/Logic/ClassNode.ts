import { Node } from "./Node";
import { FieldNode, Import } from ".";

export class ClassNode extends Node {
  private _path: String;
  private _imports: Import[] = [];
  private _fields: FieldNode[] = [];
  private _export: Boolean = true;
  private _isDefaultExport: boolean = false;

  get Path() {
    return this._path;
  }

  get IsDefaultExport() {
    return this._isDefaultExport;
  }

  get Imports() {
    return this._imports as ReadonlyArray<Import>;
  }

  get Fields() {
    return this._fields as ReadonlyArray<FieldNode>;
  }

  get Export() {
    return this._export;
  }

  SetExport(toExport: boolean) {
    this._export = toExport;
    return this;
  }

  AddImport(...imports: Import[]) {
    return this.addToArray(this._imports, ...imports);
  }

  RemoveImport(importClassNode: ClassNode) {
    return this.removeFromArray(this._imports, importClassNode);
  }

  AddField(field: FieldNode) {
    return this.addToArray(this._fields, field);
  }

  RemoveField(field: FieldNode) {
    return this.removeFromArray(this._fields, field);
  }
}
