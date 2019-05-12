import {
  IExportRules,
  INode,
  IFielNode,
  IImport
} from "..";

export interface IClassNode extends INode {
  Path: string;
  Imports: ArrayLike<IImport>;
  Fields: ArrayLike<IFielNode>;
  Export: IExportRules;
}
