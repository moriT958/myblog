+++
date = '2025-05-10T13:08:15+09:00'
draft = false
title = 'Lua基本文法まとめ'
tags = ["programming"]
+++

Neovimなどの設定記述言語として使われているLua言語の基本文法

## 文字列

- 文字列の結合は`..`
- `[[string]]`はエスケープ
- `string.format()`でpythonのfstringのように文字列が作れる

## 変数

- Luaの変数は基本的にグローバル
- 型は指定しないが存在はする(動的型付け)
- 型の種類
  - `nil`
  - `boolean`
  - `number`
  - `string`
  - `function`
  - `userdata`
  - `thread`
  - `table`

## 演算

- 四則演算

  - `+`
  - `-`
  - `*`
  - `/`
  - `%`

- 比較演算

  - `<, >`
  - `<=, >=`
  - `==, ~=`

- 論理演算

  - `and`
  - `or`
  - `not`

## I/O

`io.write()`: 標準出力への書き出し
`io.read()`: 標準入力からの読み込み

## 制御文

### if文

```: lua
if(exp) then
  ...
elseif(exp) then
  ...
else
  ...
end
```

### while文

```:lua
while (exp) do
  ...
end
```

### for文

- Numeric for

```:lua
for init, end, inc do
  ...
end
```

- Generic for

### repeat文

まず...の処理が実行される

```:lua
repeat
  ...
until (exp)
```

### break文

- `break;`
- ブロックの最後(endの手前, untilの手前etc.)にしか書けない
- それ以外の場所に書きたい場合以下のように無理やりブロックを作る

```:lua
do
  break;
end
```

## 関数

```:lua
function name(arg)
  ...
end
```

## 標準ライブラリ

- `assert(v, [, message])`: `v`が偽ならエラーを起こす
- `dofile(filename)`: ファイルを実行する
- `type(v)`: 型を返す
- `tonumber(e, [,base])`: base進数の数値へ変換(変換不可の場合nilを返す)
- `tostring(e)`: 文字列へ変換

## Luaスタック

- スタック型のデータ構造
- Luaスタックを介してC言語間とのデータのやり取りができる

- C言語でLuaを利用する場合、３つのヘッダファイルが必要。
- lua_State\*型の構造体LがLuaインタプリタの状態を保持する。
- lua_close(L)で確保された動的メモリが全て解放される。

```:c
#include <stdio.h>

#include "lua.h"
#include "lualib.h"
#include "luaxlib.h"

int main(void)
{
  lua_State* L = luaL_newstate();

  ...

  lua_close(L);
  return 0;
}
```

- Luaスタックへのプッシュ例

```:c
lua_pushboolean(L, 1);
lua_pushnumber(L, 10.5);
lua_pushinteger(L, 3);
lua_pushstring(L, "Hello world");
lua_pushnil(L);
```

- Luaスタックのサイズは、通常20に設定されている
