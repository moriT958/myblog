+++
date = '2025-05-10T12:44:43+09:00'
draft = false
title = 'Neovim設定メモ'
+++

Neovimの設定に関するメモ

## 設定

`~/.config/nvim/`以下に記述

## Neovim APIs

- `require("myluamodule")`

  - `runtimepath`内の`/lua`ディレクトリ配下を全て検索し一致ファイルを読み込む
  - 2度呼ばれ他場合は呼び出されたファイルの結果はキャッシュされ使われる
  - `package.loaded['myluamodule'] = nil`: キャッシュを削除する

- `vim.api.nvim_create_user_command(name, func, opts)`: 自作のコマンドを作成する

  - (例) `vim.api.nvim_create_user_command('Test', 'echo "It works!"', {})`)

- `vim.api.nvim_create_buf(listed, scratch)`: 新規で空のバッファを作る

  - `listed`: `buflisted`にセットするかどうか。セットされると`:ls`で表示されるようになる
  - `scratch`: scratchバッファにするかどうか。
    - スクラッチバッファはファイルを持たずテキストのみを持つ一時的なバッファ
    - ウィンドウが閉じると削除される

- `vim.api.nvim_open_win({buffer}, {enter}, {config})`: バッファをウィンドウに表示する

  - `buffer`: 表示するバッファ
  - `enter`: 開いたウィンドウに入るかどうか
  - `config`: ウィンドウのサイズや位置の設定。ウィンドウの種類が`floating`か`external`かもここで設定する

- `--@param {param} {type}`: LuanDocsの記述　アノテーションのような物
  - 引数paramがtype型の値であることを意味する

## TreeSitter APIs

[TreeSitter](https://neovim.io/doc/user/treesitter.html)

## プラグイン作成方法

- `~.nvim`ディレクトリを作成
- `lua/`, `plugin/`ディレクトリを配置
  - `lua/`: プラグイン本体のプログラムを配置。関数などを定義する
  - `plugin/`: プラグインとしてロードされた際に`lua/`で定義された関数などをNeovimにコマンドとして登録
- Lazyの設定を追加

## Lazyの仕組み(for自分)

ディレクトリ構造によって違うので注意。以下は自分だけ。

- `~/.config/nvim/init.lua`が読み込まれる
- その中で`core.lazy`モジュールが読み込まれる
- `lazy`モジュールの`setup()`関数内でその他のパッケージ(モジュール)が読み込まれる
- 個々のモジュールは`plugins/`ディレクトリに詳細が記述されている

## Luaについて/プラグインの管理方法

- プラグインの実体データは`~/.local/share/nvim/`配下にLuaプログラムとして保存されてる。

- `require("package")`は、文字列型の`package.path`の中からマッチした部分を返す
  - `?`の部分を置き換えて、そのパスが存在するかどうかを確認している
  - 返り値はstem型(型情報を持たない)なので都度キャストが必要
- 見つかった場合、`package.loaded["package"]`にキャッシュされる

`print(package.path)`を実行すると以下の文字列が表示される(一部のみ)

```: zsh
./?.lua;/opt/homebrew/share/luajit-2.1/?.lua;/usr/local/share/lua/5.1/?.lua;/usr/local/share/lua/5.1/?/init.lua;/opt/homebrew/share/lua/5.1/?.lua;/opt/homebrew/share
5.1/?/init.lua;/Users/morita/.local/share/nvim/lazy-rocks/telescope.nvim/share/lua/5.1/?.lua;/Users/morita/.local/share/nvim/lazy-rocks/telescope.nvim/share/lua/5.1/
t.lua;

```
