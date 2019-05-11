import {
  FieldNode,
  Import,
  IClassNode,
  IExportRules,
  Decorator
} from "..";
import { Node } from "./Node";

export class ClassNode extends Node implements IClassNode {
  private _path: string;
  private _imports: Import[] = [];
  private _fields: FieldNode[] = [];
  private _export: IExportRules = {
    default: false,
    export: true
  };
  private _rawContent: string;

  get Path() {
    return this._path;
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

  get RawContent() {
    return this._rawContent;
  }

  static parseObjects(objs: IClassNode[]) {
    return super.genericParseObjects(ClassNode, objs);
  }

  ToObject(): IClassNode {
    return {
      Name: this.Name,
      Path: this.Path,
      Export: this.Export,
      RawContent: this.RawContent,
      Fields: this.Fields.map((field) => field.ToObject()),
      Imports: this.Imports.map((anImport) => anImport.ToObject()),
      Decorators: this.Decorators.map((decorator) => decorator.ToObject())
    };
  }

  ParseObject(obj: IClassNode) {
    this
      .SetExport(obj.Export)
      .SetName(obj.Name)
      .SetPath(obj.Path)
      .AddField(...FieldNode.parseObjects(obj.Fields))
      .AddDecorator(...Decorator.parseObjects(obj.Decorators));

    return this;
  }

  SetExport(exportRules: IExportRules) {
    this._export = exportRules;
    return this;
  }

  SetRawContent(content: string) {
    this._rawContent = content;
    return this;
  }

  SetPath(path: string) {
    this._path = path;
    return this;
  }

  AddImport(...imports: Import[]) {
    return this.addToArray(this._imports, ...imports);
  }

  RemoveImport(importClassNode: ClassNode) {
    return this.removeFromArray(this._imports, importClassNode);
  }

  AddField(...fields: FieldNode[]) {
    return this.addToArray(this._fields, ...fields);
  }

  RemoveField(field: FieldNode) {
    return this.removeFromArray(this._fields, field);
  }
}
