import { writeFile } from "fs";
import {
  ClassNode,
  ClassCreator,
  ClassLoader,
  LibraryMap
} from "..";

export class TSD {
  private _tabSize: number;
  private _loadedClasses: ClassNode[];
  private _classCreator: ClassCreator;
  private _classLoader: ClassLoader;

  get LoadedClasses() {
    return this._loadedClasses;
  }

  get TabSize() {
    return this._tabSize;
  }

  constructor(...libraryMaps: LibraryMap[]) {
    this._classCreator = new ClassCreator(...libraryMaps);
    this._classLoader = new ClassLoader();
  }

  async Load(globPath: string) {
    const loadedFiles = await this._classLoader.ScanFiles(globPath);
    console.log(loadedFiles);
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
