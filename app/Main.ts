import { TSD, ClassNode, Import, FieldNode, Decorator, Accessor, str } from "../src";
import { Glob } from "glob";

const classNode = new ClassNode("Xo");
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
  .SetFrom("./aa")
  .AddImport("aaa", "aasdsd");

classNode
  .AddImport(Toimport1)
  .AddField(field)
  .AddDecorator(decorator);

const tsd = new TSD();
tsd.SetTabSize(2);
tsd.Write(`${__dirname}/Test.ts`, classNode);
tsd.Load(`${__dirname}/*.ts`);
