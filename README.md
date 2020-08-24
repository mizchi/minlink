# minlink

Minimum(~ 1kb) and isomorphic worker wrapper with comlink like rpc.

```bash
npm install minlink --save
# or
yarn add minlink
```

## Why?

- WebWorker(DedicateWorker) and node's Worker(`threads`) have similar api but not same one. This library wraps them to same rpc.
- `minlink` is inspired by `comlink` but to keep simple and small core, minlink does not use ES2015 Proxy(or its polyfill). Instead of proxy, `minlink` provides typescript's type utils.

## Requirements

- Node 14+
- Modern Browser + IE11(WIP: Not tested yet)

## Browser WebWorker

Minlink takes WebWorker as expose/wrap. Bundle them with webpack or rollup.

```ts
// browser worker.js
import { expose } from "minlink/dist/browser.mjs";
const impl = {
  async foo(n; number) {
    return n + 1;
  },
};
expose(self, impl);

// browesr main.js
// import { wrap } from "minlink/dist/browser.legacy.js"; // for ie11. UMD build.
import { wrap } from "minlink/dist/browser.mjs";
const api = wrap(new Worker("./worker.js"));
const ret = await api.exec("foo", 1);
console.log(ret); // => 2
await api.terminate();
```

## Node Worker

Minlink takes `worker_threads/Worker` as expose/wrap.

```ts
// main.mjs
import { wrap } from "comlink/dist/node.mjs";
import { Worker } from "worker_threads";
const worker = new Worker("./worker.mjs");
const api = wrap(worker);
const res = await api.exec("foo", 1);
console.log("response", res);

// worker.mjs
import { expose } from "minlink/dist/node.mjs";
import { parentPort } from "worker_threads";
expose(parentPort, {
  async foo(n) {
    return n + 1;
  },
});
```

## Advanced: TypeScript utilities

```ts
// browser/worker.ts
import { expose } from "minlink/dist/browser.mjs";
const impl = {
  async foo(n; number) {
    return n + 1;
  },
};
export type RemoteImpl = typeof impl;
expose(self, impl);

// browesr/main.ts
import type { RemoteImpl } from "./worker.ts"; // Typescript 3.9+ Type only import
import { wrap } from "minlink/dist/browser.mjs";
const api = wrap<RemoteImpl>(new Worker("/worker.js")); // take RemoteImpl as `wrap(...)`'s type argument.
const ret = await api.exec("foo", 1); // pass
const ret = await api.exec("foo", "invalid arg"); // type error
```

## Advanced: Transferrable

```ts
const buf = new Uint8Array([1]);
const ret = await api.exec({ name: "foo", transferrable: [buf] }, buf); // pass
```

## Advanced: Call client expose from worker.

TBD

## Inspired by ...

- https://github.com/GoogleChromeLabs/comlink
- https://github.com/developit/web-worker

## LICENSE

MIT
