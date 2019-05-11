import { Node } from "./Node";
import { Accessor, IFielNode } from "..";

export class FieldNode extends Node implements IFielNode {
  private _accessors: Accessor[] = [];
  private _typeName: string;
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

  static parseObjects(objs: ArrayLike<IFielNode>) {
    return super.genericParseObjects(FieldNode, objs);
  }

  ToObject(): IFielNode {
    return {
      Name: this.Name,
      TypeName: this.TypeName,
      Accessors: this.Accessors,
      DefaultValue: this.DefaultValue,
      Decorators: this.Decorators.map((decorator) => decorator.ToObject())
    };
  }

  ParseObject(obj: IFielNode) {
    this
      .SetName(obj.Name)
      .SetDefaultValue(obj.DefaultValue)
      .SetTypeName(obj.TypeName)
      .AddAccessor(...obj.Accessors)
      .AddDecorator();

    return this;
  }

  SetTypeName(typeName: string) {
    this._typeName = typeName;
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
