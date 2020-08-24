import path from "path";
import assert from "assert";
import { run, test } from "./test-helpers.mjs";
import { chromium, firefox, webkit } from "playwright";
import delay from "delay";
import express from "express";

const runners = [chromium, firefox, webkit];

(async function main() {
  const url = new URL(import.meta.url);
  const dirname = path.dirname(url.pathname);

  const app = express();
  app.use(express.static(path.join(dirname, "built")));
  let server;
  await new Promise((r) => {
    server = app.listen(7777, r);
  });
  for (const runner of runners) {
    test(`${runner.name()}: run`, async () => {
      const browser = await runner.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:7777`);
      await page.waitForSelector("body");
      await delay(1500);
      const res = await page.evaluate(() => document.body.innerHTML);
      // console.log(res);
      assert.strictEqual(res, "hello, mizchi");
      await browser.close();
    });
  }
  console.log("ready");
  await run();
  server.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
