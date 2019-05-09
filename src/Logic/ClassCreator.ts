import { ClassNode, TsCodeWriter, LibraryMap } from "..";

export class ClassCreator {
  private _libraryMaps: LibraryMap[];

  constructor(...libraryMaps: LibraryMap[]) {
    this._libraryMaps = libraryMaps;
  }

  GetClassContent(classNode: ClassNode) {
    const codeWriter = new TsCodeWriter();
    codeWriter
      .WriteImport(...classNode.Imports)
      .AddSpaceLine()
      .WriteClass(classNode);
    return codeWriter.Text;
  }
}
