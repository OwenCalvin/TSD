export class CodeWriter {
  private _text: string = "";
  private _tabSize: number = 2;
  private _blockDepth: number = 0;
  private _semicolonEnabled: boolean = true;
  private _currentBlockChar?: string;
  private _closingChars: { [key: string]: string } = {
    "{": "}",
    "(": ")",
    "[": "]"
  };

  get Text() {
    return this._text;
  }

  get TabSize() {
    return this._tabSize;
  }

  get SemicolonEnabled() {
    return this._semicolonEnabled;
  }

  get ClosingChars() {
    return this._closingChars;
  }

  get BlockDepth() {
    return this._blockDepth;
  }

  get CurrentBlockChar() {
    return this._currentBlockChar;
  }

  SetBlockDepth(depth: number) {
    this._blockDepth = depth;
    return this;
  }

  IncrementBlockDepth(depth: number) {
    return this.SetBlockDepth(this._blockDepth + depth);
  }

  SetClosingChars(closingChars: { [key: string]: string }) {
    this._closingChars = closingChars;
    return this;
  }

  SetCurrentBlockChar(char: string) {
    this._currentBlockChar = char;
    return this;
  }

  SetSemicolonEnabled(semiColonEnabled: boolean) {
    this._semicolonEnabled = semiColonEnabled;
    return this;
  }

  SetTabSize(tabSize: number) {
    this._tabSize = tabSize;
    return this;
  }

  NextLineWithoutSemicolon() {
    return this.SetSemicolonEnabled(false);
  }

  Write(...texts: string[]) {
    this.edit(texts.join(""));
    this.SetSemicolonEnabled(true);
    return this;
  }

  WriteLine(...texts: string[]) {
    this
      .Write(...texts)
      .AddNewLine();

    return this;
  }

  AddNewLine(times: number = 1) {
    for (let i = 0; i < times; i++) {
      this.edit("\r\n", false, false);
    }
    return this;
  }

  AddSpaceLine() {
    return this.AddNewLine(2);
  }

  StartBlock(text?: string, blockChar: string = "{") {
    this
      .NextLineWithoutSemicolon()
      .WriteLine((text ? `${text} ` : ""), blockChar)
      .SetCurrentBlockChar(blockChar)
      .IncrementBlockDepth(1);

    return this;
  }

  CloseBlock(text?: string, blockChar?: string) {
    this
      .IncrementBlockDepth(-1)
      .AddNewLine()
      .NextLineWithoutSemicolon()
      .Write((blockChar || this._closingChars[this._currentBlockChar]), (text ? ` ${text}` : ""));

    return this;
  }

  AddTab(tabSize: number) {
    return this.edit(this.getSpaces(tabSize), false);
  }

  private edit(text: string, withSc: boolean = true, withIdent: boolean = true) {
    const ident = withIdent ? this.getSpaces(this._blockDepth * this._tabSize) : "";
    const sc = this.SemicolonEnabled && withSc ? ";" : "";
    this._text += ident + text + sc;
    return this;
  }

  private getSpaces(size: number) {
    let content = "";
    for (let i = 0; i < size; i++) {
      content += " ";
    }
    return content;
  }
}
