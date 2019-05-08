import { ClassNode, ClassCreator, ClassLoader } from ".";
import { writeFile } from "fs";

export class TSD {
  private _tabSize: number;
  private _loadedClasses: ClassNode[];
  private _classCreator: ClassCreator = new ClassCreator();
  private _classLoader: ClassLoader = new ClassLoader();

  get LoadedClassed() {
    return this._loadedClasses;
  }

  get TabSize() {
    return this._tabSize;
  }

  Load(globPath: string) {
    this._classLoader.ScanFiles(globPath);
  }

  Write(path: string, classNode: ClassNode) {
    return new Promise((resolve, reject) => {
      const classContent = this._classCreator.GetClassContent(classNode);
      writeFile(
        path,
        classContent,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(classContent);
          }
        }
      );
    });
  }

  ParseObject(obj: object) {
  }

  SetTabSize(tabSize: number) {
    this._tabSize = tabSize;
    return this;
  }
}
