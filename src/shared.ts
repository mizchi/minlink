import type { JsonValue } from "type-fest";
import type { Worker as NodeWorker } from "worker_threads";

type RemoteImpl = Record<string, (...args: any[]) => Promise<any>>;
export type RemoteCall<O extends RemoteImpl, N extends keyof O = keyof O> = {
  exec<T extends keyof O = N>(func: T, ...args: Parameters<O[T]>): ReturnType<O[N]>;
  terminate(): Promise<void>;
}

// https://developer.mozilla.org/ja/docs/Web/API/Transferable
// https://nodejs.org/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist
type Transferrable = JsonValue | ArrayBuffer | ImageBitmap | OffscreenCanvas | MessagePort;

export type Expose<I extends RemoteImpl> = (impl: I) => RemoteCall<I>;
export type WorkerApi<Impl extends RemoteImpl> = RemoteCall<Impl>;
export type Cmd = string | { name: string, transferrable?: Transferrable[] }

export const REQUEST_MARK = "m$s";
export const RESPONSE_MARK = "m$r";

type Request = [mark: typeof REQUEST_MARK, id: number, cmd: Cmd, ...args: Transferrable[]]
type Response = [mark: typeof RESPONSE_MARK, id: number, error: boolean, result: Transferrable ]

export type Adapter<Ctx = any> = {
  emit(ctx: Ctx, data: Response | Request, transferrable?: Array<Transferrable>): void;
  listen(ctx: Ctx, fn: any): void;
  terminate(ctx: Ctx): Promise<void>;
};

export const createExpose = (adapter: Adapter) => (ctx: any, api: any) => {
  adapter.listen(ctx, (ev: MessageEvent) => {
    if (ev.data?.[0] !== REQUEST_MARK) {
      return;
    }
    const [, id, cmd, ...args] = ev.data as Request;
    const [cmdName, transferrable] = typeof cmd === 'string' ? [cmd, []] : [cmd.name, cmd.transferrable];
    const func = api[cmdName];
    func(...args)
      .then((result: any) => {
        adapter.emit(ctx, [RESPONSE_MARK, id, false, result], transferrable)
      })
      .catch((e: any) => adapter.emit(ctx, [RESPONSE_MARK, id, true, e?.stack ?? e?.toString() ]));
  });
};

const _sentIdMap = new Map();
let _cnt = 0;
const genId = () => _cnt++;
export const createWrap = (adapter: Adapter) => <Impl extends RemoteImpl>(
  ctx: Worker | NodeWorker
): WorkerApi<Impl> => {
  adapter.listen(ctx, (ev: MessageEvent) => {
    if (ev.data?.[0] !== RESPONSE_MARK) {
      return;
    }
    const [, id, error, result] = ev.data as Response;
    const obj = _sentIdMap.get(id);
    if (obj == null) {
      return;
    }
    _sentIdMap.delete(id);
    if (error) {
      obj.reject(result);
    } else {
      obj.resolve(result);
    }
  });
  return {
    terminate: () => adapter.terminate(ctx),
    // @ts-ignore
    exec(cmd: Cmd, ...args: Transferrable<any>) {
      const id = genId();
      return new Promise((resolve, reject) => {
        _sentIdMap.set(id, {
          resolve,
          reject,
        });
        const [cmdName, transferrable] = typeof cmd === 'string' ? [cmd, []] : [cmd.name, cmd.transferrable];
        const req = [
          REQUEST_MARK,
          id,
          cmdName,
          ...args,
        ] as Request
        adapter.emit(
          ctx,
          req,
          transferrable
        );
      });
    },
  };
};
