import { writeFile, fstat, readFile } from "fs";
import {
  ClassNode,
  ClassCreator,
  ClassLoader,
  LibraryMap,
  IClassNode
} from "..";

export class TSD {
  private _tabSize: number;
  private _loadedClasses: ClassNode[] = [];
  private _classCreator: ClassCreator;
  private _classLoader: ClassLoader;
  private _schemaFile: string = "./schema.json";

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

  async Load() {
    const classNodes: IClassNode[] = JSON.parse(await this.readFile(this._schemaFile));
    this._loadedClasses = ClassNode.parseObjects(classNodes);
  }

  async Write(classNode: ClassNode) {
    if (classNode.Path) {
      const classExists = this._loadedClasses.find((foundClassNode) =>
        foundClassNode.Path === classNode.Path || foundClassNode.Name === classNode.Name
      );
      console.log(classExists);
      if (!classExists) {
        const classContent = this._classCreator.GetClassContent(classNode);
        this._loadedClasses.push(classNode);
        await this.writeFile(classNode.Path, classContent);
        await this.writeFile(
          this._schemaFile,
          JSON.stringify(this._loadedClasses.map((loadedClass) => loadedClass.ToObject()))
        );
      } else {
        throw new Error(`Class already exists: ${classNode.Name}`);
      }
    } else {
      throw new Error(`Set a path to class: ${classNode.Name}`);
    }
  }

  SetTabSize(tabSize: number) {
    this._tabSize = tabSize;
    return this;
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
