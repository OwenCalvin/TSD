import { TSD, ClassNode, Import, FieldNode, Decorator, s } from "./Logic";
import { Accessor } from "./Types";

const classNode = new ClassNode("Xo");
const Toimport1 = new Import();
const field = new FieldNode("yop");
const decorator = new Decorator("Deco");

decorator
  .AddArgument(s`aaa`, 123, s`a`);

field
  .AddAccessor(Accessor.PRIVATE)
  .AddDecorator(decorator)
  .SetTypeName("string");

Toimport1
  .SetFrom("./aa")
  .SetImport("aaa", "aasdsd");

classNode
  .AddImport(Toimport1)
  .AddField(field)
  .AddDecorator(decorator);

const tsd = new TSD();
tsd
  .SetTabSize(2)
  .Write(`${__dirname}/Test.ts`, classNode);
