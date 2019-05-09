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
  // https://regex101.com/r/dGHElD/2
  private _rgxExport = /(?<=export)\s*.[^{]*\s*(?={)/gm;
  // https://regex101.com/r/vmvbHx/1
  private _rgxClass = /(?<=class)\s*.*(?=\s)/gm;

  /**
   * Parse a class file to get the imports
   * @param classNode The class node intsance
   */
  GetImports(classNode: ClassNode) {
    classNode.RawContent.match(this._rgxImport).map((anImport) => {
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

      classNode.AddImport(newImport);
    });

    return classNode;
  }

  /**
   * TODO: [className, isExported, isExportedByDefault]
   * @param rawContent
   */
  GetClassesInfos(rawContent: string) {
    const matches = rawContent.match(this._rgxExport);
    if (matches) {
      return matches.reduce<[string, boolean][]>((prev, match) => {
        const classes = match.match(this._rgxClass);
        if (classes) {
          return prev.concat(
            classes.map((aClass) => [
              aClass.trim(),
              false
            ])
          );
        }
        return prev;
      }, []);
    }
    return [];
  }

  async ScanFiles(path: string) {
    const files = Glob.sync(path);
    const readPromises = files.reduce<Promise<ClassNode[]>[]>((prev, file) => {
      const readPromise = new Promise<ClassNode[]>((resolve, reject) => {
        readFile(file, "utf8", (err, data) => {
          if (!err) {
            const classes = this.GetClassesInfos(data).map((classInfos) => {
              const classNode = new ClassNode();
              classNode
                .SetName(classInfos[0])
                .SetIsDefaultExport(classInfos[1])
                .SetPath(file)
                .SetRawContent(data);
              return classNode;
            });
            resolve(classes);
          } else {
            reject(err);
          }
        });
      });
      return [
        ...prev,
        readPromise
      ];
    }, []);

    const classNodes = await Promise.all(readPromises);

    const flatClassNodes = classNodes.reduce((prev, classNodes) => {
      if (classNodes.length > 0) {
        const classes = classNodes.map((classNode) => {
          this.GetImports(classNode);
          return classNode;
        });
        return [
          ...prev,
          ...classes
        ];
      }
      return prev;
    }, []);

    return flatClassNodes;
  }
}
