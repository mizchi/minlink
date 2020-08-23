import path from "path";
import assert from "assert";
import { Worker } from "worker_threads";
import { wrap } from "../dist/node.mjs";
import { test, run } from "./helpers.mjs";

function createTestWorker() {
  const url = new URL(import.meta.url);
  const dirname = path.dirname(url.pathname);
  return new Worker(path.join(dirname, "test-worker.mjs"));
}

test("call foo", async () => {
  const worker = createTestWorker();
  const api = wrap(worker);
  const res = await api.exec("foo", {});
  assert.deepStrictEqual(res, { foo: 1 });
  await worker.terminate();
});

test("call bar", async () => {
  const worker = createTestWorker();
  const api = wrap(worker);
  const res = await api.exec("foo", {});
  assert.deepStrictEqual(res, { foo: 1 });
  await worker.terminate();
});

run();
