+++
date = '2025-05-10T12:54:46+09:00'
draft = true
title = 'Gitコマンドのメモ'
tags = ["cli"]
+++

Gitで困った時に見返すノート

## 基本コマンド

- `git init`: リポジトリの初期化
- `git add [filename]`
- `git commit -, "[message]"`
- `git diff`: リポジトリとワークツリーの差分を確認
- `git diff --staged`: リポジトリとステージングエリアの差分を確認。
- `git status` :変更を加えたファイルを確認
- `git log` :変更履歴の確認。
- `git restore [filename]` :ワークツリーのファイルの変更を取り消す
- `git restore -staged [filename]` :ステージングエリアのファイルをワークツリーに戻す。
- `git branch [branch-name]` :ブランチの作成
- `git branch (-a)` :ブランチの確認、リモートリポジトリも確認する場合は-a
- `git switch [branch-name]` :HEAD(現在いるブランチ)の変更
- `git switch -c [branch-name]` :作成と移動を同時に
- `git merge [branch-name]` :現在いるブランチに対して指定したブランチをマージ
- `git merge origin/main` :リモートのブランチをローカルのメインにマージ
- `git push origin [brach-name]` :ブランチをリモートにプッシュ
- `git pull origin [branch-name]` :リモートのリポジトリをローカルのワークツリーに反映

- `git fetch origin`
  - ローカルのリポジトリに反映させるだけでワークツリーにはマージされない
  - コンフリクトが起きそうな時は fetch を使っといた方がラク

## チーム開発での基本的な流れ

- ローカルの main ブランチを最新に更新(`git pull origin main`)
- 作業するブランチを作成(`git switch -c [local-branch]`)
- 実装(`git commit -m ""`)
- リモートリポジトリにプッシュ(`git push origin [local-branch]`)
- github でプルリクエストを作成
- コードレビューをしてもらう
- merge の承認
  - (コンフリクト対策として、同じファイルを複数人で同時編集しないように心がける)

## 用語メモ

- ワークツリー(作業ディレクトリ)とインデックス(ステージングエリア)、リポジトリの 3 つの状態がある
- origin はリモートリポジトリにデフォルトでつけられるブランチ名
- ブランチはコミット(リポジトリ)に対するポインタ(ラベル)みたいなもの
- コンフリクトは複数のブランチで変更があった際に、同じ箇所に変更があると発生する。
- main は常に最新にしておく
- 一度コミットしてしまったファイルは後から.gitignore に入れてもリポジトリから消えない。消したい場合のコマンド
  - `git rm --cached [filename]` : リポジトリから削除
  - `git rm [filename]` : リポジトリだけでなく、ワークツリーからも消える
- `checkout`は`switch`+`restore`のイメージ.

## OSS 参加の流れ

### 用語

- リモート(origin): 自分のアカウントのリモートリポジトリ
- ローカル: 自分のローカル作業環境上のリポジトリ
- アップストリーム: OSS 本家のリポジトリ

### 流れ

- GitHub 上で OSS のリポジトリを自分のリモートリポジトリに fork する。
- README や CONTRIBUTIN をしっかり確認する。
- 自分のリモートリポジトリからローカルに clone する。`git clone https://github.com/moriT958/...`
- 取り組む ISSUE を決める。もしくは、自分で作成する。
- OSS のリポジトリをアップストリームに登録する。

  - `git remote add upstream https://github.com/[oss-name]`
  - `git config -l`で登録されたことを確認

- ブランチを切ってコードを修正後、リモートに push。
- リモートからアップストリームに対してプルリクを作成
- (merge されたら)アップストリームの内容をローカルに反映。

  - `git pull upstream main`
  - `git push origin main`

## その他メモ

- pullし忘れてpushしてしまった時
  - `git pull origin main --rebase`
  - `git rebase --continue`
  - `git push origin main`
