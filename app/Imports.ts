import { LibraryMap } from "../src";
import { Glob, GlobSync as asasdsa } from "glob";
import * as Buffer from "buffer";

export const imports: LibraryMap = {
  glob: {
    forPath: `${__dirname}/*.ts`,
    imports: [
      Glob
    ]
  }
};
