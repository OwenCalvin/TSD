export type LibraryMap = {
  [library: string]: {
    forPath: string,
    imports: (Function | string | [string, string] | [Function, string])[]
  }
};
