+++
date = '2025-05-10T12:46:35+09:00'
draft = false
title = 'GoデバッガDelveの使い方'
tags = ["cli"]
+++

GoのデバッガDelveの使い方メモ

## 基本コマンド

- `dlv help`: ヘルプ表示
- `dlv debug <pkg>`: デバッグの開始

- `funcs [<regex>]`: 関数一覧の表示
- `break <package>.<func>:[line]`: ブレークポイントを設定。
- `continue`: ブレークポイントまで実行
- `next`: 1行実行
- `print <val>`: 変数の値を表示
- `locals`: ローカル変数一覧を表示
- `set <val>`: 変数の値を上書き
- `list`: 現在位置のソースコードを表示
- `step`: 関数内にステップイン
- `stack`: スタック(バックトレース)の表示
- `frame <m>`: フレームをセット
- `frame <m> <cmd>`: スタックトレース上の指定のフレーム上でデバッグコマンドを実行
- `stepout`: 関数を抜ける
- `exit`: デバッグ終了
- `help <cmd>`: デバッグコマンドのヘルプ表示
