import { Node } from "./Node";
import { Accessor } from "../Types";

export class FieldNode extends Node {
  private _accessors: string[] = [];
  private _typeName: string;
  private _defaultValue?: any;

  constructor(name: string) {
    super(name);
  }

  get Accessors() {
    return this._accessors;
  }

  get TypeName() {
    return this._typeName;
  }

  get DefaultValue() {
    return this._typeName;
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
