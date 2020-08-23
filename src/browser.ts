import { createExpose, createWrap, Adapter } from "./shared";

const adapter: Adapter<Worker> = {
  emit(ctx, arg) {
    ctx.postMessage(arg);
  },
  listen(ctx, handler) {
    ctx.addEventListener("message", handler);
  },
  async terminate(ctx) {
    ctx.terminate();
  },
};

export type { WorkerApi } from "./shared";
export const expose = createExpose(adapter);
export const wrap = createWrap(adapter);
