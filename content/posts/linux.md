+++
date = '2025-05-10T12:57:03+09:00'
draft = false
title = 'Linux学習記録'
tags = ["linux", "server"]
+++

## ディレクトリ構造

- `/`: ルートディレクトリの事で、システムの最上位のディレクトリ。
- `~`: ホームディレクトリのことで、ログインしたユーザのトップディレクトリ。
- `/etc`: 設定ファイル系が格納される
- `/var`: システムなどのログや生成データが格納される

## Mac(unix)

- `uuidgen`: UUIDを生成できる
- `pbcopy/pbpaste`: クリップボードに保存・貼り付けができる。`echo "Hello,World." | pbcopy`

## systemd

### systemd概要

Linuxにおいて起動処理やシステム全体の管理を行うデーモンプロセス。

- カーネルが生成する最初のユーザプロセス

  - PID=1が割り当てられる

- systemd起動の流れ

  - BIOS/UEFI -> ブートローダ -> カーネル -> init/systemd
    - GRUB2によってHDDからメモリへカーネルがロードされる
    - カーネルはH/Wを認識できるようになった後systemdを起動する

- systemdはUnitという単位でシステム起動処理を行う

- 従来(init/upstart)との違い

  - init/upstartでは、シェルスクリプトによって起動プロセスが順番に実行されていた
    - `/etc/rc.d`配下のスクリプトが実施
  - systemdの場合、スクリプト方式は廃止。
    - これまでのスクリプトの仕事は全てUnitとして定義された
    - systemdはUnitを直接起動させる
    - init/upstartと違い、順番ではなく並列的に実行されるようになった

- Unitの特徴

  - スクリプトではなく設定ファイルに記述
  - Unit間の依存・順序関係(並列処理)の定義
  - Unitは役割によっていくつかの種類がある
    - target, mount, service, device, socketなど
  - systemd起動時、default.targetというUnitを頂点として、依存関係のツリーが構築される

- Unitの定義ファイルの場所

  - `/usr/lib/systemd/system/`: システムのデフォルトのUnit設定ファイル
  - `/etc/systemd/system`: ユーザ独自のUnit設定ファイル。優先はこっち

### systemctlコマンド一覧

systemdを操作するためのクライアント。

- `systemctl start <Unit>`: ユニット起動
- `systemctl stop <Unit>`: ユニット停止
- `systemctl restart <Unit>`: ユニット再起動
- `systemctl reload <Unit>`: ユニット
- `systemctl status <Unit>`: ユニットの状態確認
- `systemctl enable <Unit>`: 自動起動の有効化
- `systemctl disable <Unit>`: 自動起動の無効化
- `systemctl is-enabled <Unit>`: 自動起動設定の確認
- `systemctl list-unit-files --type=<type>`: ユニット一覧の表示
- `systemctl daemon-reload`: ユニット設定ファイルの再読み込み

### systemdのログ

systemdによって起動させられたUnitのログは`/var/log/journal`以下に
バイナリ形式で保存される。

`journalctl -f -u <Unit>`: ユニットのログを監視
