import { TSD, ClassNode, Import, FieldNode, Decorator, Accessor, str } from "../src";
import { Glob } from "glob";

const classNode = new ClassNode("Xo");
const classNode2 = new ClassNode("Xo2");
const Toimport1 = new Import();
const field = new FieldNode("yop");
const decorator = new Decorator(Glob.name);

decorator
  .AddArgument(str`aaa`, 123, str`a`);

field
  .AddAccessor(Accessor.PRIVATE)
  .AddDecorator(decorator)
  .SetTypeName("string");

Toimport1
  .SetName("./aa")
  .AddImport(["aaa", "aasdsd"], ["aaw213"]);

classNode
  .AddImport(Toimport1)
  .AddField(field)
  .SetPath(`${__dirname}/Test.ts`)
  .AddDecorator(decorator)
  .AddDecorator(decorator);

classNode2
  .AddImport(Toimport1)
  .AddImport(Toimport1)
  .AddField(field)
  .SetPath(`${__dirname}/Test2.ts`)
  .AddDecorator(decorator);

const tsd = new TSD();
tsd.SetTabSize(2);
tsd.Write(classNode);
tsd.Write(classNode2);
