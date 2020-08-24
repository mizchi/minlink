import type { RemoteImpl } from "./worker.test";
import { wrap, RemoteCall } from "../browser";

// 型だけのテストなので、実体はなんでもよい
const remoteApi = wrap<RemoteImpl>(null as any);

// ただしく呼べる型なのを確認
remoteApi.exec("foo", 1).then((res) => {
  // 返り値の型キャストが成功するか
  res as number;
});
// string は型エラー
// @ts-expect-error
remoteApi.exec("foo", "");

// 別のインターフェース。混ざってないかの確認
remoteApi.exec("bar", "");
// @ts-expect-error
remoteApi.exec("bar", 1);
