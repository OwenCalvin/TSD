import {
  Accessor,
  INode
} from "..";

export interface IFielNode extends INode {
  Accessors: Accessor[];
  TypeName: string;
  DefaultValue: any;
}
