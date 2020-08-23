import type { JsonValue } from "type-fest";
import type { Worker as NodeWorker } from "worker_threads";

export type WorkerApi = {
  exec(cmd: string, args?: JsonValue, transferables?: Array<any>): Promise<any>;
  terminate(): Promise<void>;
};

type Request = {
  scope: typeof scope;
  id: string;
  cmd: string;
  args: JsonValue;
};

type Response =
  | {
      result: JsonValue;
      id: string;
      error?: false;
    }
  | {
      result: Error;
      id: string;
      error: true;
    };
export type Adapter<Ctx = any, Arg = any> = {
  emit(ctx: Ctx, arg: JsonValue): void;
  listen(ctx: Ctx, fn: any): void;
  terminate(ctx: Ctx): Promise<void>;
};

export const scope = "$m";

export const createExpose = (adapter: Adapter) => (ctx: any, api: any) => {
  adapter.listen(ctx, (ev: MessageEvent) => {
    const data = ev.data;
    if (data?.scope === scope) {
      const { cmd, id, args = {} } = data as Request;
      const func = api[cmd];
      func(args)
        .then((result: any) => adapter.emit(ctx, { result, id }))
        .catch((e: any) => adapter.emit(ctx, { result: e, id, error: true }));
    }
  });
};

const _sender = new Map();
export const createWrap = (adapter: Adapter) => (
  ctx: Worker | NodeWorker
): WorkerApi => {
  adapter.listen(ctx, (ev: MessageEvent) => {
    const data = ev.data;
    const { error, id, result } = data as Response;
    if (id) {
      const obj = _sender.get(id);
      if (obj == null) {
        return;
      }
      _sender.delete(id);
      if (error) {
        obj.reject(result);
      } else {
        obj.resolve(result);
      }
    }
  });
  return {
    terminate: () => adapter.terminate(ctx),
    exec(cmd: string, args: any = {}, transferables?: Array<any>) {
      const id = Math.random();
      return new Promise((resolve, reject) => {
        _sender.set(id, {
          resolve,
          reject,
        });
        adapter.emit(
          ctx,
          {
            scope,
            cmd,
            id,
            args,
          },
          // @ts-ignore
          transferables || []
        );
      });
    },
  };
};
