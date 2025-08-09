---
author: もーりー
pubDatetime: 2025-08-09T23:14:16.663+09:00
title: (備忘録)JavaScriptにおける非同期処理を学んだ
slug: about javascript and typescript asynchronous
featured: true
draft: false
tags:
  - javascript
  - typescript
description: JavaScript・TypeScriptにおける非同期処理を学んだ。その内容を自分用にまとめた。
---

JavaScript・TypeScriptにおける非同期処理を学んだので、その内容を見返す用にまとめました。

## Table of contents

## Javascriptのスレッド

JavaScriptはシングルスレッド上で実行される。
ブラウザには主に以下の３つのスレッドが存在し、JavaScriptが実行されるのは Main Thread。

- **Main Thread** (JSの実行とレンダリング処理を行う)
- Service Worker
- Web Worker

## 同期処理と非同期処理

- 同期処理: メインスレッド上で順番に処理が進んでいく
- 非同期処理: 一時的にメインスレッドから処理が切り離される

例) setTimeout(callback, ms)

setTimeoutを実行した時点でメインスレッドから切り離される。
そして非同期APIに渡されたのち、指定した時間後にコールバックがタスクキューに積まれる。

## タスクキューとコールスタック

重要な登場人物一覧:

1. コールスタック

- 実行済みのコンテキストが積まれる
- コンテキストには、関数コンテキストやグローバルコンテキストがある
- コンテキストが持つ情報:
  - ローカル変数や引数の値
  - 計算途中の値を持つ
  - 関数終了後にどこに戻るか

2. イベントループ

- コールスタックにコンテキストが積まれているかを監視している
- 監視結果をタスクキューに通知する

3. タスクキュー

- 実行待ちの関数行列(FIFO)
- イベントループから通知を受け取り、スタックコールが空の場合、積まれている関数を実行する
- 関数の実行結果はコンテキストとしてコールスタックに積まれる
- １つのループあたり実行できる関数は１個まで

## Promise

- Promiseの状態
  - `pending`: Promiseが生成された時の初期状態
  - `fullfilled`: Promiseがresolveした時の状態
  - `rejected`: Promiseがrejectした時の状態

Promiseのコード例

```js
new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log("Task done");
  });
  resolve("hello"); // Promiseをfulfilled状態にし、thenのハンドラをキューに登録
  // reject("fail"); // Promiseをrejected状態にし、catchのハンドラをキューに登録
})
  .then(function (data) {
    // resolveの引数が渡ってくる
    console.log(data); // -> "hello"
    return data + " morita"; // 次のthenに値を渡す(渡される型はPromise)
  })
  .then(function (data) {
    console.log(data); // -> "hello morita"
    throw new Error("fail"); // このエラーは次のcatchに渡される
  })
  .catch(function (error) {
    // rejectの引数、またはthrowされたエラーが渡ってくる
    console.error(error);
  })
  .finally(function () {
    console.log("Promise処理終了（成功・失敗問わず）");
  });

console.log("Global context end");
```

## MicroTasks と MacroTasks

キューには２種類ある。

### Macro Tasks (タスクキュー)

- setTimeoutやsetIntervalのコールバックなどの非同期処理が積まれる
- １回のイベントループあたりに１つのタスクを実行する

### Micro Tasks (ジョブキュー)

- Promiseのthenなどの非同期処理が積まれる
- タスクキューよりもジョブキューの方が先に実行される
- １回のイベントループあたりに積まれている全てのジョブが実行される

### コードの実行順序

以下のコードを実行した時の実行順は？

```js
console.log("starting");

new Promise(function (resolve) {
  setTimeout(function () {
    console.log("task1");
  });
  resolve();
})
  .then(function () {
    console.log("job1");
  })
  .then(function () {
    console.log("job2");
  });

console.log("Global context end");
```

答え:

```txt
starting
global context end
job1
job2
task1
```

処理の流れ:

- コールスタックにグローバルコンテキストが積まれる
- **(1)"starting"が表示**
- "task1"がタスクキューに登録される
- "job1"がジョブキューに登録される
- "job2"がジョブキューに登録される
- **(2)"global context end"が表示**
  - (グローバルコンテキストがコールスタックから取り出される)
- コールスタックが空になり、先にジョブキューの全ての関数が実行される
- **(3)"job1"が表示**
- **(4)"job2"が表示**
- 再度コールスタックが空になり、ジョブキューも空なので、タスクキューの関数が実行される
- **(5)"task1"が表示**

## await/async

- asyncで定義されている関数の返り値は必ずPromise
- awaitは、Promiseを返す関数の非同期処理が完了するのを待つ

コード例

```ts
const fetchCoffee = async (): Promise<void> => {
  const response = await fetch("https://api.sampleapis.com/coffee/hot");
  const coffeeList = await response.json();
  console.log(coffeeList);
};

fetchCoffee();
```

## Promiseの静的メソッドを使った並行処理

Promiseの並行処理に関する静的メソッド一覧

### 1. Promise.all

引数にはPromiseを格納した反復可能オブジェクトを入れる。
全てのPromiseが"fullfiled"となった場合のみ成功扱い。
１つでも"rejected"となると、失敗となる。

返り値は、以下のようなPromiseを１つ返す。

```txt
// 成功時
Promise { <state>: "fulfilled", <value>: Array[5] }

// 失敗時
Promise { <state>: "rejected", <reason>: 5 }
```

### 2. Promise.race

最も早く"pending"状態が終わったPromiseを返す。
そのため、返ってくるPromiseは"fullfiled"か"rejected"のどちらかわからない。
また、どのPromiseも解決してない場合は"pending"となる

返り値の例:

```txt
// 成功時
Promise { status: 'fulfilled', value: 100 }

// 失敗時
Promise { status: 'rejected', reason: 300 }

// 未解決時
Promise { status: 'pending' }
```

### 3. Promise.allSettled

全てのPromiseが解決する("pending"状態から抜ける)とそれら全てを返す。

返り値の例:

```txt
[
   { status: 'fulfilled', value: 33 },
   { status: 'fulfilled', value: 66 },
   { status: 'rejected', reason: Error: an error }
]
```

### Promise.allを使用した並行処理の実例

リストの要素を並行処理でインクリメントする

```ts
const incNums = async (nums: number[]): Promise<number[]> => {
  return Promise.all(nums.map(n => n + 1))
    .then((result: number[]) => {
      if (result.length === 0) {
        throw new Error("failed to increment all nums");
      }
      return result;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const nums = [1, 2, 3, 4, 5];
console.log(nums);
incNums(nums).then((result: number[]) => {
  console.log(result);
});

// ==== 出力 ====
// [ 1, 2, 3, 4, 5 ]
// [ 2, 3, 4, 5, 6 ]
```
