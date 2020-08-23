# Main

```foo.ts
// worker thread
import {expose} from './minilink'
expose(self, {
  async foo(args) {
    return args.v + 1;
  }
});

// main thread
import {wrap} from './minilink'
const api = wrap(new Worker('/myworker.js'));
const ret = await api.exec('foo', {v:1});
console.log(ret); // => 2
```
