import path from "path";
import assert from "assert";
import { Worker } from "worker_threads";
import { wrap } from "../dist/node.mjs";
import { test, run } from "./test-helpers.mjs";

function createTestWorker() {
  const url = new URL(import.meta.url);
  const dirname = path.dirname(url.pathname);
  return new Worker(path.join(dirname, "test-worker.mjs"));
}

test("call add", async () => {
  const worker = createTestWorker();
  const api = wrap(worker);
  const res = await api.exec("add", 1, 1);
  assert.deepStrictEqual(res, 2);
  await worker.terminate();
});

test("call {name: 'add'}", async () => {
  const worker = createTestWorker();
  const api = wrap(worker);
  const res = await api.exec({ name: "add" }, 1, 1);
  assert.deepStrictEqual(res, 2);
  await worker.terminate();
});

run();
