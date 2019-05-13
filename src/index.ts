import { Container } from "./kernel/Container";

const container = new Container();

container
  .getKoaService()
  .then(koa => koa.start())
  .catch(err => console.error(err));
