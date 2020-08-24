import "regenerator-runtime";
import { expose } from "../../../dist/browser";
expose(self, {
  async greeting(name: string) {
    return `hello, ${name}`;
  },
});
