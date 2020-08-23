import "regenerator-runtime";

import { expose } from "../src/browser";
expose(self, {
  async foo(args: any) {
    return {
      ...args,
      foo: 1,
    };
  },
});
