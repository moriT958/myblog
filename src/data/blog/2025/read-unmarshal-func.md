---
author: もーりー
pubDatetime: 2025-07-24T22:07:58.379+09:00
modDatetime: 2025-07-25T22:06:06.565+09:00
title: encoding/jsonのUnmarshal関数を読む
slug: read unmarshal func in go
featured: true
draft: true
tags:
  - go, 自作JSON
description: Goの標準パッケージencoding/jsonのUnmarshal関数を読む
---

Go標準パッケージ`encoding/json`の`Unmarshal()`を読んでいく際のメモ

`decodeState`オブジェクトがパースの大部分を担っていることがわかった。

Unmarshal内では、大まかに以下の流れで処理が行われているようだった。

- `[]byte`で受け取ったJsonをバリデーション(`checkValid(data []byte, scan *scanner) error`)
- `decodeState`オブジェクトを初期化(`d.init()`)
- `d.unmarshal()`でパース処理のメイン部分を行なっている
  - ここの部分を深ぼって読んでいく

## decodeState構造体

```go
// decodeState represents the state while decoding a JSON value.
type decodeState struct {
 data                  []byte
 off                   int // next read offset in data
 opcode                int // last read result
 scan                  scanner
 errorContext          *errorContext
 savedError            error
 useNumber             bool
 disallowUnknownFields bool
}
```

- [ ] `decodeState.unmarshal(v any) error`を読み解く

※ `decodeState.scan`の挙動も少し気になった
