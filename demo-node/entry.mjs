import { Worker } from "worker_threads";
import path from "path";
import { wrap } from "../dist/node.mjs";

const url = new URL(import.meta.url);
const dirname = path.dirname(url.pathname);

const worker = new Worker(path.join(dirname, "worker.mjs"));
console.log("worker");
const api = wrap(worker);

(async () => {
  console.log("start");
  const x = await api.exec("foo", {});
  console.log("response", x);
})();
