# minilink

WIP

minimum and isomorphic worker comlink like rpc for node's Worker and browser's WebWorker.

## Requirements

- Node 14+
- Modern Browser + IE11(WIP)

## Browser WebWorker

Minlink takes WebWorker as expose/wrap.

```ts
// browser worker.js
import { expose } from "minilink/browser";
expose(self, {
  async foo(args) {
    return args.v + 1;
  },
});

// browesr main.js
import { wrap } from "minilink/browser";
const api = wrap(new Worker("/myworker.js"));
const ret = await api.exec("foo", { v: 1 });
console.log(ret); // => 2
```

## Node Worker

Minlink takes `worker_threads/Worker` as expose/wrap.

```ts
// main.mjs

import { Worker } from "worker_threads";
import path from "path";
import { wrap } from "comlink/node.mjs";

const url = new URL(import.meta.url);
const dirname = path.dirname(url.pathname);

const worker = new Worker(path.join(dirname, "worker.mjs"));
const api = wrap(worker);

const x = await api.exec("foo", {});
console.log("response", x);
})();

// worker.mjs

import { parentPort } from "worker_threads";
import { expose } from "minilink/node.mjs";

expose(parentPort, {
  async foo(args) {
    return {
      ...args,
      foo: 1,
    };
  },
});
```

## Advanced: Call client expose from worker.

## TODO

- playwright browser test
- Publish
- TypeScript transform or register support

## LICENSE

MIT
