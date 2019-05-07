import * as Glob from "glob";
import { ClassNode, Writer } from ".";
import { writeFile } from "fs";

export class TSD {
  private _tabSize: number;
  private _loadedClasses: ClassNode[];
  private _writer: Writer = new Writer();

  get LoadedClassed() {
    return this._loadedClasses;
  }

  get TabSize() {
    return this._tabSize;
  }

  Load(globPath: string) {
  }

  Write(path: string, classNode: ClassNode) {
    return new Promise((resolve, reject) => {
      const classContent = this._writer.GetClassContent(classNode);
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
