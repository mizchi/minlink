import { createExpose, createWrap, Adapter } from "./shared";

let _handler: any = null;
const adapter: Adapter<Worker> = [
  // emit
  (_ctx, arg) => {
    _handler({ data: arg });
  },
  // @ts-ignore
  (_ctx, handler) => (_handler = handler),
  // @ts-ignore
  // terminate
  () => (_handler = null),
];

export type { WorkerApi, RemoteCall } from "./shared";
export const expose = createExpose(adapter);
export const wrap = createWrap(adapter);
