import { ClassNode, CodeWriter, Decorator } from ".";

export class Writer {
  GetClassContent(classNode: ClassNode) {
    const codeWriter = new CodeWriter();
    this.writeImports(classNode, codeWriter);
    this.writeClass(classNode, codeWriter);
    console.log(codeWriter.Text);
    return codeWriter.Text;
  }

  private writeImports(classNode: ClassNode, codeWriter: CodeWriter) {
    classNode.Imports.map((toImport) => {
      const importsContent = toImport.Imports.reduce<string[]>((prev, importDependency) => {
        const importText = importDependency[0] + (importDependency[1] ? ` as ${importDependency[1]}` : "");
        return [
          ...prev,
          importText
        ];
      }, []);

      codeWriter
        .StartBlock("import")
        .NextLineWithoutSemicolon()
        .Write(importsContent.join(", "))
        .CloseBlock(`from "${toImport.From}"`)
        .AddSpaceLine();
    });
  }

  private writeClass(classNode: ClassNode, codeWriter: CodeWriter) {
    this.writeDecorators(classNode.Decorators, codeWriter);
    codeWriter.StartBlock(
      `${classNode.Export ? "export " : ""}${classNode.IsDefaultExport ? " default" : ""}class ${classNode.Name}`
    );
    classNode.Fields.map((field) => {
      this.writeDecorators(field.Decorators, codeWriter);
      codeWriter
        .Write(`${field.Accessors.join(" ")} ${field.Name}: ${field.TypeName}`);
    });
    codeWriter
      .CloseBlock()
      .AddNewLine();
  }

  private writeDecorators(decorators: Decorator[], codeWriter: CodeWriter) {
    decorators.map((decorator) => {
      codeWriter
        .NextLineWithoutSemicolon()
        .Write(`@${decorator.Name}(${decorator.Arguments.join(", ")})`)
        .AddNewLine();
    });
  }
}
