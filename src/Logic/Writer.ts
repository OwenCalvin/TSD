import { ClassNode, TsCodeWriter, Decorator } from ".";

export class Writer {
  GetClassContent(classNode: ClassNode) {
    const codeWriter = new TsCodeWriter();
    codeWriter
      .WriteImport(...classNode.Imports)
      .AddSpaceLine()
      .WriteClass(classNode);
    console.log(codeWriter.Text);
    return codeWriter.Text;
  }
}
