import "regenerator-runtime";
import { wrap } from "../src/browser";
const worker = new Worker("./worker.ts");
const api = wrap(worker);
(async () => {
  const x = await api.exec("foo", {});
  console.log("response", x);
})();
