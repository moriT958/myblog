---
author: もーりー
pubDatetime: 2025-07-05T14:43:47.235+09:00
title: Goの並行処理とその実装例
slug: about go concurrency
featured: true
draft: true
tags:
  - go
description: Goで並行処理を実装するパターンの紹介と、A Tour of Goでの実装例。
---

# goroutines

- Go のランタイムに管理される軽量なスレッド。
- 前提知識
- プロセスとは？：実行中プログラムのインスタンス。OS によって生成され、コード、データ、ファイルハンドル、スタック、ヒープメモリを含む。他のプロセスとはメモリ空間を共有せず、独立している。
- スレッドとは？：プロセス内で実行される軽量な実行単位。1 プロセスに複数のスレッドが存在可能(マルチスレッド)。各スレッドは同じメモリ空間を共有し、独自のスタックを持つ。
- 並行処理とは？：複数のタスクに対して、CPU が高速でタスクの切り替えを行うことで、同時にタスクが処理されているように見せる方法。
- 並列処理とは？：CPU が複数のコアやプロセッサを持つ場合、物理的にタスクを割り当て、同時に処理を行う方法。GPU などを使うこともできる。
- 一般的に並列処理を扱うものとして、コルーチン(coroutines)があり、goroutines もその一種。

- main 関数で実行される処理も goroutine であり、他の goroutine の基準点となる。
- goroutines は fork-join モデルを採用しており、親ルーティンから子ルーティンをフォーク(分岐)させ、処理が終わると親ルーティンにジョイン(合流)するようになっている。
- 実行する関数の前に go キーワードを付けるだけでその処理をフォークさせることができる。

- 親ルーティンが先に処理を終えてしまうと、子ルーティンとの合流ポイントが消えてしまうため、子ルーティンが実行されない可能性がある。
- sync.WaitGroup パッケージなどを使用して、親ルーティンに合流ポイント作成しておくのが確実。

# 並行処理と並列処理

- 並行処理(Concurrency)
  　ある時間の範囲において、複数のスレッドを扱うこと。

- 並列処理(Parallelism)
  　ある時間の点において、複数のスレッドを扱うこと

Go 公式ブログ"Concurrency is not parallelism"では以下のように述べられている。  
「プログラミングにおいて、並列処理は(関連する可能性のある)処理を同時に実行することであるのに対し、並行処理はプロセスをそれぞれ独立に実行できるような構成のことを指します。
並行処理は一度に多くのことを「扱う」ことであり、並列処理は一度に多くのことを「行う」ことです。」

- ハードかソフトかの観点での違い
  　並行処理は、問題解決の手段としてのプログラミングパターンのこと。並列処理は、並行処理を可能にするハードウェアの特性のことです。
  また、並行性はコードの性質を指し、並列性は動作しているプログラムの性質を指します。

- 以下のように言える
  「ユーザーは並列なコードを書いているのではなく、並列に走ってほしいと思う並行なコードを書いている」
  「並行なコードが、実際に並列に走っているかどうかは知らなくていい」

Go 言語で作れるのは「コード/ソフトウェア」であり、前述した通りそれらの性質を指し示すのは「並行性」のほうです。

# ゴルーチンとチャネル

go 文は渡された関数を、同じアドレス空間中で独立した並行スレッド(ゴールーチン)の中で実行します。

新しく立ち上げたゴルーチンの実行が終わるまでメインゴルーチンが待つ必要がある場合は、sync パッケージの WaitGroup を使う。

チャネルは、特定の型の値を送信・受信することで(異なるゴールーチンで)並行に実行している関数がやり取りする機構を提供している。
異なるゴールーチン同士が、特定の型の値を送受信することでやりとりする機構。

チャネルを立ち上げた場合、そのゴルーチンは作成したチャネルから値を受け取るまでブロックされるため、待ち合わせを行う必要はない。
ブロック=>何かしらの原因でスレッド(ゴルーチン)の実行が進まなくなること。DB のデッドロックのような状態。

# Go 並列処理基礎

## チャネルの状態

1. nil かどうか
2. closed かどうか
3. バッファが空いているか(バッファに値があるか)
4. 送信/受信専用かどうか

## チャネルに対する操作

1. 値の受信
2. 値の送信
3. クローズ操作

## チャネルの状態と操作の関係

![](https://storage.googleapis.com/zenn-user-upload/2ecc11e5f2ad8dd9ab62c3f4.png)

- nil チャネルへの値の送受信を行うと、送受信を行なったゴルーチンはブロックされる。

以上より以下のことが言える。  
　チャネルを通して、値を送信するゴルーチンとそれを受け取るゴルーチンがあるとする。
受信側のゴルーチンの準備が整うまで、送信側はブロックされたようにチャネルによって制御される。
このことから、チャネルは WaitGroup のような、実行同期のための機構でもある。

※ Goの参照型について
Goのスライス型、マップ型、ポインタ型、チャネル型が当てはまる。

参照型を使ったゴルーチンを使用する時は、ゴルーチンが参照する値がその時々によって変わってしまう可能性があるので注意。
例えばappend関数をゴルーチンの中で使用する際など。
appnedは第一引数で受け取ったスライスの番地を参照し、第二引数の値を追加した新たなスライスを返す。
そのため、参照型の値のやり取りではチャネルを活用する。もしくは、参照するスライスに排他制御を行うこともできる。(sync.Mutex)

- closeされたチャネルから値を受信しようとすると、ゼロ値のnilが返ってくる。
  返ってきたnilが、値として返ってきたものなのか、closedチャネルのゼロ値として返ってきたのかを判断するには、第2引数を見る。
  `val, ok := chan`このokはチャネルから受信した場合はtrue、そうでない場合はfalseが入る。

# ゴルーチンやチャネルを用いた実装パターン

1. 拘束

```
func restFunc() <-chan int {
 // 1. チャネルを定義
 result := make(chan int)

 // 2. ゴールーチンを立てて
 go func() {
  defer close(result) // 4. closeするのを忘れずに

  // 3. その中で、resultチャネルに値を送る処理をする
  // (例)
  for i := 0; i < 5; i++ {
   result <- 1
  }
 }()

 // 5. 返り値にresultチャネルを返す
 return result
}
```

resultチャネルが使えるスコープをrestFunc内に留める(=拘束する)ことで、
あらぬところから送信が行われないように保護することができ、安全性が高まります。
ちなみに、resultのように、特定の値をひたすら生成するだけのチャネルをジェネレータという。

2. select分

```
select {
case num := <-gen1:  // gen1チャネルから受信できるとき
 fmt.Println(num)
case num := <-gen2:  // gen2チャネルから受信できるとき
 fmt.Println(num)
default:  // どっちも受信できないとき
 fmt.Println("neither chan cannot use")
}
```

受信可能なチャネルから値を得ることができる。
これと同じことをifで実装しようとすると、最初の分岐条件がFalseだった時点でそのゴルーチンがロックされてしまい、デッドロックになる可能性がある。
そのため、以上のようにselect文を用いるようにする。

3. セマフォ

```
var sem = make(chan int, MaxOutstanding)

func handle(r *Request) {
    sem <- 1    // Wait for active queue to drain.
    process(r)  // May take a long time.
    <-sem       // Done; enable next request to run.
}

func Serve(queue chan *Request) {
    for {
        req := <-queue
        go handle(req)  // Don't wait for handle to finish.
    }
}
```

Serveは、queueチャネルからリクエストを受け取って、それをhandleする。
ですが、このままだと際限なくhandle関数を実行するゴールーチンが立ち上がってしまいます。それをセマフォとして制御するのがバッファありのsemチャネルです。
handle関数の中で、リクエストを受け取ったらsemに値を1つ送信、リクエストを処理し終えたらsemから値を1つ受信という操作をしています。
もしもsemチャネルがいっぱいになったら、sem <- 1の実行がブロックされます。そのため、semチャネルの最大バッファ数以上のゴールーチンが立ち上がることを防いでいます。

また、これをうまく利用すれば、リーキーバケットアルゴリズムの実装が容易にできる。

※ バッファありチャネル
make(chan int, 2): int型のチャネルをサイズ2のバッファ付きで作成
バッファが詰まったときはチャネルへの送信をブロックする。

4. メインルーチンからサブルーチンを停止させる
   使ってないゴールーチンを稼働したまま放っておくということは、そのスタック領域をGCされないまま放っておくことになる。
   これはパフォーマンス的にあまりよくない事態を引き起こし、このような現象のことをゴールーチンリークという。

```
func generator(done chan struct{}) <-chan int {
 result := make(chan int)
 go func() {
  defer close(result)
  for {
   select {
   case <-done:
                // doneチャネルは空なので、こっちの処理はブロックされ実行されない。
                // しかし、doneチャネルがcloseされると、ゼロ値のnilが返ってくるので実行される。
    break
   case result <- 1:
   }
  }
 }()
 return result
}

func main() {
 done := make(chan struct{})

 result := generator(done)
 for i := 0; i < 5; i++ {
  fmt.Println(<-result)
 }
 close(done)
}
```

generatorはひたすら無限に1を生成するジェネレータ。doneチャネルを使って終了を制御している。
※ doneチャネルはclose操作のみ行い、値などは特に渡さないため、chan struct{}型で定義しておく。こうするとメモリ領域の節約ができる。

5. FanIn(ファン-イン)
   複数個あるチャネルから受信した値を、1つの受信用チャネルの中にまとめる方法をFanInといいます。

```
func fanIn1(done chan struct{}, c1, c2 <-chan int) <-chan int {
 result := make(chan int)

 go func() {
  defer fmt.Println("closed fanin")
  defer close(result)
  for {
   // caseはfor文で回せないので(=可変長は無理)
   // 統合元のチャネルがスライスでくるとかだとこれはできない
   select {
   case <-done:
    fmt.Println("done")
    return
   case num := <-c1:
    fmt.Println("send 1")
    result <- num
   case num := <-c2:
    fmt.Println("send 2")
    result <- num
   default:
    fmt.Println("continue")
    continue
   }
  }
 }()

 return result
}

func main() {
 done := make(chan struct{})

 gen1 := generator(done, 1) // int 1をひたすら送信するチャネル(doneで止める)
 gen2 := generator(done, 2) // int 2をひたすら送信するチャネル(doneで止める)

 result := fanIn1(done, gen1, gen2) // 1か2を受け取り続けるチャネル
 for i := 0; i < 5; i++ {
  <-result
 }
 close(done)
 fmt.Println("main close done")

 // resultチャネルに値が残ってしまうことがあるので、ゴルーチンリークにならないよう後片付け。
 for {
  if _, ok := <-result; !ok {
   break
  }
 }
}
```

6. FanIn応用
   FanInでまとめたいチャネル群が可変長変数やスライスで与えられている場合は、select文を直接使用することができないため、以下のようにする。

```
func fanIn2(done chan struct{}, cs ...<-chan int) <-chan int {
 result := make(chan int)

 var wg sync.WaitGroup
 wg.Add(len(cs))

 for i, c := range cs {
  // FanInの対象になるチャネルごとに個別にゴールーチンを立てちゃう
  go func(c <-chan int, i int) {
   defer wg.Done()

   for num := range c {
    select {
    case <-done:
     fmt.Println("wg.Done", i)
     return
    case result <- num:
     fmt.Println("send", i)
    }
   }
  }(c, i)
 }

 go func() {
  // selectでdoneが閉じられるのを待つと、個別に立てた全てのゴールーチンを終了できる保証がない
  wg.Wait()
  fmt.Println("closing fanin")
  close(result)
 }()

 return result
}
```

7. タイムアウトの実装
1. time.After関数を使用した場合
   time.After関数は、引数d時間経ったら値を送信するチャネルを返す関数。

- 例「1秒以内にselectできるならずっとそうする、できなかったらタイムアウト」

```
for {
    select {
    case s := <-ch1:
        fmt.Println(s)
    case <-time.After(1 * time.Second): // ch1が受信できないまま1秒で発動
        fmt.Println("time out")
        return
    /*
    }
}
```

- 例「select文を実行し続けるのを1秒間行う」

```
timeout := time.After(1 * time.Second)

// このforループを1秒間ずっと実行し続ける
for {
 select {
 case s := <-ch1:
  fmt.Println(s)
 case <-timeout:
  fmt.Println("time out")
  return
 default:
  fmt.Println("default")
  time.Sleep(time.Millisecond * 100)
 }
}
```

2. time.NewTimerの構造体を使用した場合
   time.NewTimerのコード

```
type Timer struct {
 C <-chan Time
 // contains filtered or unexported fields
}

func NewTimer(d Duration) *Timer
```

- 例「1秒以内にselectできるならずっとそうする、できなかったらタイムアウト」

```
for {
 t := time.NewTimer(1 * time.Second)
 defer t.Stop()

 select {
 case s := <-ch1:
  fmt.Println(s)
 case <-t.C:
  fmt.Println("time out")
  return
 }
}
```

- 例「select文を実行し続けるのを1秒間行う」

```
t := time.NewTimer(1 * time.Second)
defer t.Stop()

for {
 select {
 case s := <-ch1:
  fmt.Println(s)
 case <-t.C:
  fmt.Println("time out")
  return
 default:
  fmt.Println("default")
  time.Sleep(time.Millisecond * 100)
 }
}
```

- time.Afterとtime.NewTimerの使い分け
  time.After(d)で得られるものはNewTimer(d).Cと同じで、
  内包されているタイマーは、作動されるまでガベージコレクトによって回収されることはない。
  効率を重視する場合、time.NewTimerの方を使い、タイマーが不要になったタイミングでStopメソッドを呼んでください。

8. 結果のどれかを使う(moving on)
   例: DBへのコネクションConnが複数個存在して、その中から得られた結果のうち一番早く返ってきたものを使って処理をしたいという場合。

```
func Query(conns []Conn, query string) Result {
    ch := make(chan Result, len(conns))
 // connから結果を得る作業を並行実行
    for _, conn := range conns {
        go func(c Conn) {
            select {
            case ch <- c.DoQuery(query):
            default:
            }
        }(conn)
    }
    return <-ch
}

func main() {
 // 一番早くchに送信されたやつだけがここで受け取ることができる
 result := Query(conns, query)
 fmt.Println(result)
}
```

「doneチャネルを使ってのルーチン閉じ作業」は省略しているので注意。
