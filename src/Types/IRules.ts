import {
  IExportRules,
  LibraryMap,
  Decorator
} from "..";

export interface IRules {
  exportRules: IExportRules;
  imports: LibraryMap[];
  classDecorators: Decorator[];
  fieldDecorators: Decorator[];
}
