import { Node } from "./Node";
import { Accessor, IFielNode } from "..";

export class FieldNode extends Node implements IFielNode {
  private _accessors: Accessor[] = [];
  private _typeName: string;
  private _isArray: boolean;
  private _isNullable: boolean;
  private _defaultValue?: any;

  get Accessors() {
    return this._accessors;
  }

  get TypeName() {
    return this._typeName;
  }

  get DefaultValue() {
    return this._defaultValue;
  }

  get IsArray() {
    return this._isArray;
  }

  get IsNullable() {
    return this._isNullable;
  }

  static parseObjects(objs: ArrayLike<IFielNode>) {
    return super.genericParseObjects(FieldNode, objs);
  }

  ToObject(): IFielNode {
    return {
      Name: this.Name,
      TypeName: this.TypeName,
      Accessors: this.Accessors,
      DefaultValue: this.DefaultValue,
      Decorators: this.Decorators.map((decorator) => decorator.ToObject()),
      IsNullable: this._isNullable,
      IsArray: this._isArray
    };
  }

  ParseObject(obj: IFielNode) {
    this
      .SetName(obj.Name)
      .SetDefaultValue(obj.DefaultValue)
      .SetType(obj.TypeName)
      .AddAccessor(...obj.Accessors)
      .AddDecorator();

    return this;
  }

  SetType(type: string | Function) {
    this._typeName = typeof type === "string" ? type : type.name;
    return this;
  }

  SetIsArray(isArray: boolean) {
    this._isArray = isArray;
    return this;
  }

  SetIsNullable(isNullable: boolean) {
    this._isNullable = isNullable;
    return this;
  }

  SetDefaultValue(defaultValue: any) {
    this._defaultValue = defaultValue;
    return this;
  }

  AddAccessor(...accessors: Accessor[]) {
    return this.addToArray(this._accessors, ...accessors);
  }

  RemoveAccessor(accessor: string) {
    return this.removeFromArray(this._accessors, accessor);
  }
}
