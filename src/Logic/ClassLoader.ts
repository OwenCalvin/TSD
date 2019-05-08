import * as Glob from "glob";
import { readFile } from "fs";
import { ClassNode, Import } from ".";

export class ClassLoader {
  // I've created a few regex matches
  // https://regex101.com/r/dX2dHe/1
  private _rgxImport = /import(\s*)(({(.[^}]*)})|(\*\s*as.*))(\s*)from\s*".[^"]*"/gms;
  // https://regex101.com/r/ulP19G/1
  private _rgxImportAs = /(?<=import\*as)(.*)(?=from".[^"]*")/gm;
  // https://regex101.com/r/Vl66Xb/1
  private _rgxDependency = /(?<=import{)(.*)(?=})/gm;
  // https://regex101.com/r/CS9VuN/1
  private _rgxFrom = /(?<=from")(.*)(?=")/gm;
  // https://regex101.com/r/ocToVj/1
  private _rgxSpaces = /\s+/gm;

  private _loadedFiles: ClassNode[] = [];

  GetImports(classNode: ClassNode) {
    console.log(classNode.Path);
    const imports = classNode.RawContent.match(this._rgxImport).map((anImport) => {
      const newImport = new Import();
      const normalizedImport = anImport.replace(this._rgxSpaces, "");
      const from = normalizedImport.match(this._rgxFrom)[0];
      const as = normalizedImport.match(this._rgxImportAs);
      const dependencies = normalizedImport.match(this._rgxDependency);
      if (dependencies) {
        dependencies[0].split(",").map((dependency) => {
          const dependencyParams = dependency.split(" as ");
          newImport.AddImport(dependencyParams[0], dependencyParams[1]);
        });
      }

      newImport.SetFrom(from);
      if (as) {
        newImport.SetDefault(as[0]);
      }

      console.log(newImport);

      return classNode;
    });
  }

  async ScanFiles(path: string) {
    const readPromises: Promise<ClassNode>[] = [];
    const files = Glob.sync(path);
    files.map((file) => {
      const readPromise = new Promise<ClassNode>((resolve, reject) => {
        readFile(file, "utf8", (err, data) => {
          if (!err) {
            const classNode = new ClassNode();
            classNode
              .SetPath(file)
              .SetRawContent(data);
            resolve(classNode);
          } else {
            reject(err);
          }
        });
      });
      readPromises.push(readPromise);
    });
    const classNodes = await Promise.all(readPromises);
    classNodes.map((classNode) => {
      this.GetImports(classNode);
    });
    return classNodes;
  }
}
