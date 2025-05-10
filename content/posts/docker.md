+++
date = '2025-05-10T12:50:24+09:00'
draft = false
title = 'よく使うDockerコマンド'
tags = ["cli"]
+++

コマンド忘れがちなのでメモ残しときます

## コマンドまとめ

- `docker container run [option] <image> [command]`
  - `--rm`
  - `--interactive`, `-i`
  - `--tty`, `-t`
  - `--detach`, `-d`
  - `--name <name>`
  - `--env "<key>=<value>"`
  - `--env-file <file>`
  - `--publish <hostport>:<containerport>`, `-p`
  - `--platform`
  - `--volume <name>:<target>`
  - `--mount type=<bind|mount>,src=<name>,dst=<target>`
  - `--network <network>`
  - `--network-alias`
- `docker container ls [option]`
  - `--all`, `-a`
- `docker container stop [option] <container>`
- `docker container rm [option] <container>`
  - `--force`, `-f`
- `docker container exec [option] <container> command`

- `docker image ls [option]`
- `docker image pull [option] <image>`
- `docker image build [option] <path>`
  - `--file`
  - `--tag`, `-t`
- `docker image history [option] <image>`

- `docker volume create [option]`
  - `--name`
- `docker volume ls`
- `docker volume inspect <name>`
- `docker volume rm <name>`

- `docker network create [option] name`
- `docker network ls`
- `docker network inspect <name>`

- `docker compose up [option]`
  - `--detach`, `-d`
  - `--build`
- `docker compose down [option]`

## 仮想化の種類

1. ホスト型仮想化
   ホストOS常に仮想化ソフトをインストールし、仮想化ソフト内でゲストOSが動く。
   (例) Oracle VM etc

2. ハイパーバイザ型仮想化
   ハイパーバイザというソフトを、ホストOSとは別にハードウェア上に直接インストールする。
   ゲストOSはハイパーバイザ上で動く。(例) Microsoft Hyper-v

3. コンテナ型仮想化
   コンテナ管理ソフトをホストOS常にインストールする。ゲストOSはインストールせず、代わりにアプリケーションという
   ゲストOSが存在してるように振る舞うファイルやコマンドなどをコンテナ管理ソフト常にインストールする。
   (例) Docker

## Dockerの構成要素

### 1.Docker engine

コンテナ管理ソフトとして動作するDockerの本体部分。

### 2. Docker CLI

Docker engineをコマンドで操作するためのインターフェース部分。

### 3. Docker Compose

Docker CLIのコマンドをまとめて実行してくれる便利ツール。

### 4. Docker Desktop

DockerをMacOSやwindows上でGUIで使用するために必要な物をまとめたパッケージ。以下が梱包されている。

- Docker engine
- Docker CLI
- Docker Compose
- Linux Kernel

### 5. Docker Hub

リモートでDockerイメージを保存する場所。pullやpushコマンドでイメージを取り出したり保存したりできる。

## Docker基礎知識

- コンテナは仮想OSではない。コンテナはただの１プロセスであり、Linuxの名前空間という機能によって他のプロセスと競合しないようになっている。
- イメージはレイヤというメタ情報が積み重なって構成されている。イメージには単一ファイルのような実体はなく、複数のjsonファイルなどに記述されたメタ情報の集合によって、概念として存在している。
- Dockerfileを使うことで、既存のイメージに新たに独自のレイヤを追加することができる。

## コンテナ

### 基本コマンド(container)

- `docker container run [option] <image> [command]`: コンテナを起動する
  - `--rm`: コンテナが停止したら自動で削除する
  - `--interactive, -i`: コンテナの標準入力に接続する
  - `--tty, -t`: 擬似ターミナルを割り当てる.(ttyとは、STDIN,STDOUTと接続するデバイスのこと)
  - `--detach, -d`: コンテナをバックグラウンド実行する
  - `--name <name>`: コンテナに名前をつける
  - `--env <key>=<value>`: 環境変数を指定
  - `--publish,-p <hostport>:<containerport>`: ポートのマッピング
  - `--platform`: イメージが対象とするホストのアーキテクチャを指定
  - `[command]`はコンテナ起動時に実行される指定命令。指定しない場合デフォルト命令が実行される
- `docker container ls [option]`: コンテナ一覧の表示
  - `--all, -a`: 起動中のコンテナだけでなく、停止中のコンテナも表示
- `docker container stop [option] <container>`: コンテナを停止する
- `docker container rm [option] <container>`: コンテナを削除する
  - `--force, -f`: 起動中のコンテナも強制的に削除
- `docker container exec [option] <container> command`: 起動中のコンテナでコマンドを実行する

※ `--platform`オプションについて。

ホストのアーキテクチャは主に２種類あり、AppleSiliconはarm64、IntelやAMDはamd64となっている。
イメージの多くはamd64は大体サポートしているが、arm64をサポートしていないことがある。
この時に、ホストがarm64でも強制的にamd64のイメージを使用することを指定するために使う。

### コンテナの状態

　コンテナの実態はプロセス。コンテナ=１つのメインプロセスなので、コンテナ起動=プロセスの実行と捉えられる。
そのため、コンテナのメインプロセスが終了するということはコンテナの停止を意味する。

　同じイメージから作られたコンテナでも別々に独立して起動する(別物である)。そのため、コンテナ内での状態変更を他のコンテナにも反映したい場合、以下の対策をとる。

- 変更を反映した新たなイメージを作り直す
- ボリュームやバインドマウントを使用して、ホストに変更を保存しておく。

※ コンテナは仮想OSではないので、SSH接続は基本的にしない。execコマンドで接続するようにする。

## イメージ

### 基本コマンド(image)

- `docker image ls [option]`: イメージ一覧の表示
- `docker image pull [option] <image>`: DockerHubからイメージを取得する
  - `<image>`の指定は`IMAGE ID`もしくは`REPOSITORY:TAG`の形式で指定する

## Dockerfile

### 基本コマンド(Dockerfile)

- `docker image build [option] <path>`: Dockerfileからイメージを作成する
  - `--file, -f`: Dockerfileを指定する
  - `--tag, -t`: ビルド結果にタグをつける
- `docker image history [option] <image>`: イメージのレイヤを確認する

### 記法

- `FROM`: ベースイメージを指定する
- `RUN`: 任意のコマンドを実行する
- `COPY`: ホストマシンのファイルをイメージに追加する
- `CMD`: デフォルト命令を指定する

　イメージは１行１レイヤとして生成される。そのため、イメージサイズを抑えたい場合は、コマンドを&&で繋げて行数を減らす。
ただし、レイヤはキャッシュされるため、開発段階ではあえて行数を増やして書いた方が、ビルド時にキャッシュを利用する部分が多くなり、
ビルドが早くなるためそうした方がいい。

　また、完成イメージのサイズを小さくしたい場合、行数を減らすだけでなくマルチステージビルドも活用する。

## ボリュームマウント

　コンテナは終了すると中のデータは全て消滅する。データを永続化したい場合、ボリュームに保存する。
コンテナのデータをそのまま保存したい際に有効。

### 基本コマンド(volume)

- `docker volume create [option]`: ボリュームを作成する
  - `--name`:ボリューム名を指定
- `docker volume ls`: 一覧表示
- `docker volume inspect <name>`: 詳細表示
- `docker volume rm <name>`: 削除
- `docker container run [option] image [command]`: コンテナにボリュームをマウントする
  - どっちかのoptionをつける
  - `-v,--volume`: 指定方法`--volume <name>:<target>`
  - `--mount`: 指定方法`--mount type=volume,src=<name>,dst=<target>`

## バインドマウント

　ボリュームマウントでは永続化データをDockerが管理するのに対し、バインドマウントではホストの指定したディレクトリに保存し管理する。
ホスト側での永続化データの変更をコンテナ内に反映したい時に有効。

### 基本コマンド(bind)

- `docker container run [option] image [command]`: コンテナにボリュームをマウントする
  - どっちかのoptionをつける
  - `-v,--volume`: 指定方法`--volume <hostpath>:<target>`
  - `--mount`: 指定方法`--mount type=bind,src=<hostpath>,dst=<target>`

## ネットワーク

　コンテナ間の接続を可能にする。

### 基本コマンド(network)

- `docker network create [option] name`: ネットワークの作成
- `--network`: コンテナをネットワークに接続。`docker container run`のオプションで指定。
- `--network-alias`: コンテナにネットワーク内でのエイリアスを指定。
- `docker network ls`: 一覧表示
- `docker network inspect <name>`: 詳細表示

### ネットワークドライバ

　コンテナをネットワークに接続する際に必要な物。以下２種類あり、デフォルトはブリッジネットワーク。

1. ブリッジネットワーク: 同一のDocker Engine上のコンテナが通信する場合。
2. オーバーレイネットワーク: 異なるDocker Engine上のコンテナが通信する場合。

### ユーザ定義ブリッジネットワーク

　デフォルトのブリッジネットワークは以下のデメリットがあるため、自信で定義したネットワークを使用するべき。

1. 全てのコンテナに対して通信先にコンテナのIPアドレスを割り当てる必要がある。
2. 同じDocker Engine上のコンテナは全て接続できてしまう。

　ユーザ定義ネットワークを利用することで、全てのコンテナに対して通信先のIPアドレスを割り当てる必要がなくなる。
接続したいネットワークを指定するだけで、自動的にDNS解決が行われる。また、接続できるのはネットワーク内のみのコンテナとなるため、隔離度が上がる。

### 接続確認

`docker container inspect`と`docker network inspect`を使用して接続確認を行う。

- ネットワークのゲートウェイがコンテナのゲートウェイを一致しているか？
- コンテナのIPアドレスがネットワークのサブネットに含まれるか？

## Docker Compose

### 基本コマンド(docker compose)

- `docker compose up [option]`: 起動
  - `-d,--detach`: バックグラウンド実行
  - `--build`: イメージの変更を反映
- `docker compose down [option]`: 終了

`compose.yml`ファイルで設定を定義

```: compose.yml
version: '3.9'

services:
  app:
    container_name: app-container
    build:
      dockerfile: docker/app/Dockerfile
      context: .
    ports:
      - '18000:8000'
    volumes:
      - type: bind
        source: ./src
        target: /src
    command: php -S 0.0.0.0:8000 -t /src

  db:
    container_name: db-container
    image: mysql:5.7
    platform: linux/amd64
    volumes:
      - type: volume
        source: db-volume
        target: /var/lib/mysql
      - type: bind
        source: ./docker/db/init.sql
        target: /docker-entrypoint-initdb.d/init.sql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_USER: hoge
      MYSQL_PASSWORD: password
      MYSQL_DATABASE: event

volumes:
  db-volume:
```
