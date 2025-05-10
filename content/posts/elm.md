+++
date = '2025-05-10T12:52:08+09:00'
draft = false
title = 'Bubbleteaで学ぶElmアーキテクチャ'
+++

最近ハマってるGoのTUIフレームワークBubbleteaのメモなど

BubbleTeaは、TUIでのフロントエンド構築用フレームワーク

Elmアーキテクチャを実装している。
Elmアーキテクチャを構成する要素

- Model: アプリケーションの状態を保持したデータ
- View: Modelの状態を表示するための関数
- Update: Modelを更新するための関数
- Msg: モジュール間で通信するためのデータ。親から子へ一方通行の伝搬
- Cmd: elmランタイムに対してMsgを登録し実行させるためのデータ。Msgを返す関数で副作用はCmdで扱う。

## 処理の流れ

- ユーザからの入力やイベント
- ランタイム(BubbleTea)がUpdateを呼び出す
  - 入力やイベントはUpdateにMsgという形で渡される
- UpdateはMsgの種類・内容に応じてModelを更新する

Update, Viewは純粋関数

## Bubble Teaでの実装

- Modelは以下３つのメソッドを持つインターフェース

  - `Init() Cmd`
  - `Update(Msg) (Model, Cmd)`
  - `View() string`

- Updateは値呼び関数なので、変更後のモデルを返している
- Msgは`interface{}`なので型はなんでもOK。Msgは以下のような種類が定義されている

  - `tea.KeyMsg`: キー入力
  - `tea.WindowSizeMsg`: ウィンドウサイズ変更
  - `tea.MouseMsg`: マウスイベント

- Cmdは`func() Msg`でMsgを返す関数型

  - CmdはI/O処理を実行するために使われる
  - Updateから返されたCmdは、BubbleTeaランタイムがgoroutineとして非同期に実行する
  - Cmdの使用例
    - HTTPリクエストを送信し、結果のMsgを返すCmd
    - ファイルを読み込み、grepした結果のMsgを返すCmd
    - 現在時刻を取得し、Msgにして返すCmd
    - `tea.Batch`: 複数のCmdを実行するCmd
    - `tea.Exec`: 別のプログラムを実行するCmd
    - `tea.Quit`: プログラムを終了するCmd
