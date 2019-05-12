import {
  relative,
  dirname,
  parse
} from "path";
import {
  writeFile,
  readFile,
  readFileSync
} from "fs";
import {
  ClassNode,
  IClassNode,
  Import
} from "..";

export class TSD {
  private _tabSize: number;
  private _loadedClasses: ClassNode[] = [];
  private _schemaFile: string = "./schema.json";

  get LoadedClasses() {
    return this._loadedClasses;
  }

  get TabSize() {
    return this._tabSize;
  }

  constructor() {
    this.Load();
  }

  async Load() {
    const classNodes: IClassNode[] = JSON.parse(
      readFileSync(this._schemaFile, "utf8")
    );
    this._loadedClasses = ClassNode.parseObjects(classNodes);
  }

  async Write(classNode: ClassNode) {
    if (classNode.Path) {
      const classExistsIndex = this._loadedClasses.findIndex((foundClassNode) =>
        foundClassNode.Path === classNode.Path || foundClassNode.Name === classNode.Name
      );
      if (classExistsIndex > -1) {
        this._loadedClasses.splice(classExistsIndex, 1);
      }
      this._loadedClasses.push(classNode);
      classNode.AddImport(...this.getFieldImports(classNode));
      await this.writeFile(classNode.Path, classNode.Content);
      await this.writeFile(
        this._schemaFile,
        JSON.stringify(this._loadedClasses.map((loadedClass) => loadedClass.ToObject()))
      );
    } else {
      throw new Error(`Set a path to class: ${classNode.Name}`);
    }
  }

  SetTabSize(tabSize: number) {
    this._tabSize = tabSize;
    return this;
  }

  private getFieldImports(classNode: ClassNode) {
    return classNode.Fields.reduce<Import[]>((prev, field) => {
      const relation = this._loadedClasses.find((loadedClass) =>
        loadedClass.Name === field.TypeName && loadedClass.Name !== classNode.Name
      );
      if (relation) {
        const importPathInfos = parse(
          relative(
            dirname(classNode.Path),
            relation.Path
          )
        );
        const importPath = `./${importPathInfos.dir}/${importPathInfos.name}`;
        const importExists = classNode.Imports.find((foundImport) =>
          foundImport.Name === importPath
        );
        if (!importExists) {
          const newImport = new Import();
          newImport
            .SetName(importPath)
            .AddImport([relation.Name]);

          return [
            ...prev,
            newImport
          ];
        }
      }
      return prev;
    }, []);
  }

  private readFile(path: string) {
    return new Promise<string>((resolve, reject) => {
      readFile(
        path,
        "utf8",
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(content);
          }
        }
      );
    });
  }

  private writeFile(path: string, content: string) {
    return new Promise((resolve, reject) => {
      writeFile(
        path,
        content,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(content);
          }
        }
      );
    });
  }
}
