import { parentPort } from "worker_threads";
import { expose } from "../dist/node.mjs";

expose(parentPort, {
  async foo(args) {
    return {
      ...args,
      foo: 1,
    };
  },
});
