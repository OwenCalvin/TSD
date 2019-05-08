export type LibraryMap = {
  [library: string]: {
    imports: (Function | string | [string, string] | [Function, string])[]
  }
};
