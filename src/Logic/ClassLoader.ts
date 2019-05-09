import * as Glob from "glob";
import { readFile } from "fs";
import { ClassNode, Import } from ".";

export class ClassLoader {
  // I've created a few regex matches
  // https://regex101.com/r/dX2dHe/1
  private _rgxImport = /import(\s*)(({(.[^}]*)})|(\*\s*as.*))(\s*)from\s*".[^"]*"/gms;
  // https://regex101.com/r/ulP19G/1
  private _rgxImportAs = /(?<=import\*as)(.*)(?=from".[^"]*")/gm;
  // https://regex101.com/r/0thwyo/2
  private _rgxDependency = /(?<={).[^}]*(?=})/gms;
  // https://regex101.com/r/CS9VuN/1
  private _rgxFrom = /(?<=from")(.*)(?=")/gm;
  // https://regex101.com/r/ocToVj/1
  private _rgxSpaces = /\s+/gm;
  private _loadedFiles: ClassNode[] = [];

  /**
   * Parse a class file to get the imports
   * @param classNode The class node intsance
   */
  GetImports(classNode: ClassNode) {
    console.log(classNode.Path);

    const imports = classNode.RawContent.match(this._rgxImport).map((anImport) => {
      const newImport = new Import();
      const normalizedImport = anImport.trim().replace(this._rgxSpaces, "");
      const from = normalizedImport.match(this._rgxFrom)[0];
      const as = normalizedImport.match(this._rgxImportAs);
      const dependenciesStr = anImport.match(this._rgxDependency);
      if (dependenciesStr) {
        dependenciesStr[0].trim().split(",").map((dependency) => {
          const dependencyParams = dependency.trim().split(" as ");
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

    return classNode;
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
