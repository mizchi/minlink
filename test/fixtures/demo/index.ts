import "regenerator-runtime";
import { wrap } from "../../../dist/browser";
const worker = new Worker("./worker.ts");
const api = wrap(worker);
(async () => {
  const text = await api.exec("greeting", "mizchi");
  document.body.innerHTML = text;
})();
