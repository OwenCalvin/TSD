import { ClassNode, TsCodeWriter } from ".";

export class ClassCreator {
  GetClassContent(classNode: ClassNode) {
    const codeWriter = new TsCodeWriter();
    codeWriter
      .WriteImport(...classNode.Imports)
      .AddSpaceLine()
      .WriteClass(classNode);
    return codeWriter.Text;
  }
}
