const testQueue = [];

export function test(name, func) {
  testQueue.push([name, func]);
}

export async function run() {
  try {
    await Promise.all(
      testQueue.map(async (q) => {
        const [name, func] = q;
        const start = Date.now();
        await func().then(() => {
          const ms = Date.now() - start;
          console.log(`[PASS]`, name, `:${ms}ms`);
        });
      })
    );
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}
