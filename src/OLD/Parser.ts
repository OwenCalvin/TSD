// import { readFile, BinaryData,
// Dirent, access as AAAA } from "fs";
// import { ClassNode } from "./ClassNode";
// import { Import } from ".";
// import { LineJobs } from "../Types";

// export class Parser {
//   private a: String;

//   async Parse(file: string) {
//     console.log(`Parsing: ${file}`);
//     const rawContent = await this.GetFileContent(file);
//     const normalizedContent = this.getEachExpressions(rawContent);
//     const extracted = this.extractDefinition(normalizedContent);
//     this.evaluate(extracted);
//   }

//   async GetFileContent(file: string) {
//     return new Promise<string>((resolve, reject) => {
//       readFile(file, "utf8", (err, data) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(data);
//         }
//       });
//     });
//   }

//   private evaluate(lines: string[]) {
//     console.log(lines);
//     const classNode = new ClassNode();

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i];
//       const lineJob = this.getLineJob(line, classNode);

//       switch (lineJob) {
//         case LineJobs.IMPORT:
//           const toImport = new Import();
//           toImport.SetImport(lines[++i]);
//           toImport.SetFrom(lines[++i]);
//           classNode.AddImport(toImport);
//           break;
//       }
//     }

//     console.log(classNode);
//   }

//   private getLineJob(line: string, classNode: ClassNode) {
//     if (line === LineJobs.IMPORT) {
//       return LineJobs.IMPORT;
//     }

//     if (line.split(" ").includes(LineJobs.CLASS)) {
//       return LineJobs.CLASS;
//     }

//     if (line.match(/\(.*\)/)) {
//       return LineJobs.METHOD;
//     }
//   }

//   private extractDefinition(lines: string[]) {
//     const extracted = [];
//     let parentBlockDepth: number = 0;
//     const maxDepth = 1;

//     lines.map((line) => {
//       if (line === "{") {
//         parentBlockDepth++;
//       }

//       if (parentBlockDepth <= maxDepth) {
//         extracted.push(line);
//       }

//       if (line === "}") {
//         parentBlockDepth--;
//       }
//     });

//     return extracted;
//   }

//   private getImportInfos(lines: string[], lineIndex: number) {
//     for (let i = lineIndex + 1; i < lines.length; i++) {
//     }
//   }

//   private getEachExpressions(rawContent: string) {
//     return rawContent
//       .replace(/\r\n|\n|\r/gm, "\n")
//       .replace(/^\s*[\r\n]/gm, "")
//       .replace(/;\n*/g, ";")
//       .replace(/,(\n|\s*)/g, ",")
//       .replace(/{|}/g, "\n$&\n")
//       .replace(/"/g, "")
//       .split(/;|\n/g)
//       .map((expr) => expr.trim())
//       .filter((expr) => expr.length > 0);
//   }
// }
