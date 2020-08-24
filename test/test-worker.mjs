import { parentPort } from "worker_threads";
import { expose } from "../dist/node.mjs";

expose(parentPort, {
  async add(a, b) {
    return a + b;
  },
});
