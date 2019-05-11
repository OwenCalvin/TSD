import * as Glob from "glob";
import { readFile } from "fs";
import { ClassNode, Import, IExportRules } from "..";

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
  // https://regex101.com/r/qtb8KA/1
  private _rgxLines = /(\n|\r\n|\s{1,})+/gm;
  // https://regex101.com/r/uUbmqn/5
  private _rgxDeclaration = /(@.[^(]*\(.[^)]*\)\s*)*(export|)(\s{1,}default|)\s{1,}(class|interface|let|const|type)\s{1,}.[^{;\r\n]*\s*(?={|;|\n|\r\n)/gms;
  // https://regex101.com/r/bSb2yW/2
  private _rgxClass = /(?<=class)\s{1,}.*\s*(?=)/gm;

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
          newImport.AddImport([dependencyParams[0], dependencyParams[1]]);
        });
      }

      newImport.SetName(from);
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
    const declarations = rawContent.match(this._rgxDeclaration);
    if (declarations) {
      return declarations.reduce<[string, IExportRules][]>((prev, declaration) => {
        const pureDeclaration = declaration.trim().replace(this._rgxLines, " ");
        if (pureDeclaration) {
          const classes = pureDeclaration.trim().match(this._rgxClass);
          if (classes) {
            const className = classes[0].trim();
            const params = pureDeclaration.split(" ");
            console.log(params);
            return [
              ...prev,
              [
                className,
                {
                  default: params.includes("default"),
                  export: params.includes("export")
                }
              ]
            ];
          }
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
                .SetExport(classInfos[1])
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
