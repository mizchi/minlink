import { expose } from "../memory";

const impl = {
  async foo(n: number) {
    return n;
  },
  async bar(s: string) {
    return s.length;
  },
};

export type RemoteImpl = typeof impl;

expose(self, impl);
