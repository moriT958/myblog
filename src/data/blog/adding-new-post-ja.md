---
author: Sat Naing
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-06-13T16:52:45.934Z
title: AstroPaperテーマでの新しい投稿の追加
slug: adding-new-posts-in-astropaper-theme
featured: true
draft: true
tags:
  - docs
description: AstroPaperテーマを使用して新しい投稿を作成・追加するためのルールと推奨事項。
---

[Adding new posts in AstroPaper theme](https://astro-paper.pages.dev/posts/adding-new-posts-in-astropaper-theme/#frontmatter) の日本語訳です。

AstroPaperブログテーマで新しい投稿を作成するためのルール・推奨事項、ヒント・テクニックをご紹介します。

<figure>
 <img
   src="https://images.pexels.com/photos/159618/still-life-school-retro-ink-159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
   alt="書き物道具、ヴィンテージ時計、革のバッグがある古典的な木製デスクの無料写真"
 />
   <figcaption class="text-center">
   写真提供：<a href="https://www.pexels.com/photo/brown-wooden-desk-159618/">Pixabay</a>
 </figcaption>
</figure>

## Table of contents

## ブログ投稿の作成

新しいブログ投稿を作成するには、`src/data/blog/`ディレクトリ内にマークダウンファイルを作成します。

> AstroPaper v5.1.0より前は、すべてのブログ投稿が`src/data/blog/`に配置される必要があり、サブディレクトリに整理することができませんでした。

AstroPaper v5.1.0 以降、ブログ投稿をサブディレクトリに整理できるようになり、コンテンツの管理が容易になりました。

例えば、投稿を`2025`でグループ化したい場合は、`src/data/blog/2025/`に配置できます。これは投稿のURLにも影響し、`src/data/blog/2025/example-post.md`は`/posts/2025/example-post`でアクセス可能になります。

サブディレクトリが投稿URLに影響しないようにしたい場合は、フォルダ名の前にアンダースコア`_`を付けます。

```bash
# 例：ブログ投稿の構造とURL
src/data/blog/very-first-post.md          -> mysite.com/posts/very-first-post
src/data/blog/2025/example-post.md        -> mysite.com/posts/2025/example-post
src/data/blog/_2026/another-post.md       -> mysite.com/posts/another-post
src/data/blog/docs/_legacy/how-to.md      -> mysite.com/posts/docs/how-to
src/data/blog/Example Dir/Dummy Post.md   -> mysite.com/posts/example-dir/dummy-post
```

> 💡 ヒント：フロントマターでブログ投稿のスラッグを上書きすることもできます。詳細は次のセクションをご覧ください。

ビルド出力にサブディレクトリのURLが表示されない場合は、node_modulesを削除し、パッケージを再インストールしてから再ビルドしてください。

## フロントマター

フロントマターは、ブログ投稿（記事）に関する重要な情報を保存する主要な場所です。フロントマターは記事の上部にあり、YAML形式で記述されます。フロントマターとその使用方法の詳細については、[Astroドキュメント](https://docs.astro.build/ja/guides/markdown-content/)をお読みください。

各投稿のフロントマタープロパティの一覧は以下の通りです。

| プロパティ         | 説明                                                                                                             | 備考                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **_title_**        | 投稿のタイトル（h1）                                                                                             | 必須<sup>\*</sup>                                 |
| **_description_**  | 投稿の説明。投稿の抜粋とサイト説明で使用されます。                                                               | 必須<sup>\*</sup>                                 |
| **_pubDatetime_**  | ISO 8601形式での公開日時                                                                                         | 必須<sup>\*</sup>                                 |
| **_modDatetime_**  | ISO 8601形式での更新日時（ブログ投稿が更新された場合のみ追加）                                                   | オプション                                        |
| **_author_**       | 投稿の著者                                                                                                       | デフォルト = SITE.author                          |
| **_slug_**         | 投稿のスラッグ。このフィールドはオプションです。                                                                 | デフォルト = スラッグ化されたファイル名           |
| **_featured_**     | ホームページの注目セクションにこの投稿を表示するかどうか                                                         | デフォルト = false                                |
| **_draft_**        | この投稿を「未公開」としてマークする                                                                             | デフォルト = false                                |
| **_tags_**         | この投稿の関連キーワード。配列YAML形式で記述。                                                                   | デフォルト = others                               |
| **_ogImage_**      | 投稿のOG画像。ソーシャルメディア共有とSEOに有用。リモートURLまたは現在のフォルダに対する相対画像パスを指定可能。 | デフォルト = `SITE.ogImage`または生成されたOG画像 |
| **_canonicalURL_** | 記事が他のソースに既に存在する場合の正規URL（絶対）                                                              | デフォルト = `Astro.site` + `Astro.url.pathname`  |
| **_hideEditPost_** | ブログタイトル下の編集投稿ボタンを非表示にする。現在のブログ投稿にのみ適用。                                     | デフォルト = false                                |
| **_timezone_**     | 現在のブログ投稿のIANA形式でのタイムゾーンを指定。現在のブログ投稿の`SITE.timezone`設定を上書きします。          | デフォルト = `SITE.timezone`                      |

> ヒント！コンソールで`new Date().toISOString()`を実行することでISO 8601の日時を取得できます。ただし、引用符は削除してください。

フロントマターでは、`title`、`description`、`pubDatetime`フィールドのみが必須で指定する必要があります。

タイトルと説明（抜粋）は検索エンジン最適化（SEO）に重要なため、AstroPaperではブログ投稿にこれらを含めることを推奨しています。

`slug`はURLの一意の識別子です。したがって、`slug`は一意で他の投稿と異なる必要があります。`slug`の空白は`-`または`_`で区切る必要がありますが、`-`が推奨されます。スラッグはブログ投稿のファイル名を使用して自動生成されます。ただし、ブログ投稿のフロントマターで`slug`を定義することもできます。

例えば、ブログファイル名が`adding-new-post.md`で、フロントマターでスラッグを指定しない場合、Astroはファイル名を使用してブログ投稿のスラッグを自動作成します。したがって、スラッグは`adding-new-post`になります。しかし、フロントマターで`slug`を指定すると、これがデフォルトのスラッグを上書きします。詳細については[Astroドキュメント](https://docs.astro.build/ja/guides/content-collections/#defining-custom-slugs)をお読みください。

ブログ投稿で`tags`を省略した場合（つまり、タグが指定されていない場合）、デフォルトタグ`others`がその投稿のタグとして使用されます。デフォルトタグは`content.config.ts`ファイルで設定できます。

```ts file="src/content.config.ts"
export const blogSchema = z.object({
  // ---
  draft: z.boolean().optional(),
  tags: z.array(z.string()).default(["others"]), // "others"を任意の値に置き換える
  // ---
});
```

### サンプルフロントマター

投稿のサンプルフロントマターは以下の通りです。

```yaml file="src/data/blog/sample-post.md"
# src/content/blog/sample-post.md
---
title: 投稿のタイトル
author: あなたの名前
pubDatetime: 2022-09-21T05:17:19Z
slug: the-title-of-the-post
featured: true
draft: false
tags:
  - いくつかの
  - 例
  - タグ
ogImage: ../../assets/images/example.png # src/assets/images/example.png
# ogImage: "<https://example.org/remote-image.png>" # リモートURL
description: これは例の投稿の説明例です。
canonicalURL: <https://example.org/my-article-was-already-posted-here>
---
```

## 目次の追加

デフォルトでは、投稿（記事）に目次（toc）は含まれません。目次を含めるには、特定の方法で指定する必要があります。

`目次`をh2形式（マークダウンでは##）で記述し、投稿に表示したい場所に配置します。

例えば、目次を紹介段落の直下に配置したい場合（私が通常行うように）、以下のように行うことができます。

<!-- prettier-ignore-start -->
```md
---
# フロントマター
---

AstroPaperブログテーマで新しい投稿を作成するためのいくつかの推奨事項、ヒント・テクニックをご紹介します。

## 目次

<!-- 投稿の残り -->
```
<!-- prettier-ignore-end -->

## 見出し

見出しについて注意すべきことが一つあります。AstroPaperブログ投稿では、タイトル（フロントマターのタイトル）を投稿のメイン見出しとして使用します。したがって、投稿内の残りの見出しはh2〜h6を使用する必要があります。

このルールは必須ではありませんが、視覚的、アクセシビリティ、SEO目的で強く推奨されます。

## シンタックスハイライト

AstroPaperはデフォルトのシンタックスハイライトとして[Shiki](https://shiki.style/)を使用しています。AstroPaper v5.4以降、[@shikijs/transformers](https://shiki.style/packages/transformers)を使用してフェンスコードブロックをより良く拡張しています。使用したくない場合は、以下のように単純に削除できます。

```bash
pnpm remove @shikijs/transformers
```

```js file="astro.config.ts"
// ...
// [!code --:5]
import {
transformerNotationDiff,
transformerNotationHighlight,
transformerNotationWordHighlight,
} from "@shikijs/transformers";

export default defineConfig({
// ...
markdown: {
remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
shikiConfig: {
// より多くのテーマについては <https://shiki.style/themes> を参照
themes: { light: "min-light", dark: "night-owl" },
defaultColor: false,
wrap: false,
transformers: [
transformerFileName(),
// [!code --:3]
transformerNotationHighlight(),
transformerNotationWordHighlight(),
transformerNotationDiff({ matchAlgorithm: "v3" }),
],
},
},
// ...
}
```

## ブログコンテンツ用画像の保存

マークダウンファイル内で画像を保存し表示するための2つの方法があります。

> 注意！マークダウンで最適化された画像をスタイリングする必要がある場合は、[MDXを使用](https://docs.astro.build/en/guides/images/#images-in-mdx-files)してください。

### `src/assets/`ディレクトリ内（推奨）

`src/assets/`ディレクトリ内に画像を保存できます。これらの画像は[Image Service API](https://docs.astro.build/en/reference/image-service-reference/)を通じてAstroによって自動的に最適化されます。

これらの画像を提供するために、相対パスまたはエイリアスパス（`@/assets/`）を使用できます。

例：`/src/assets/images/example.jpg`のパスにある`example.jpg`を表示したいとします。

```md
![何か](@/assets/images/example.jpg)

<!-- または -->

![何か](../../assets/images/example.jpg)

<!-- imgタグやImageコンポーネントの使用は機能しません ❌ -->
<img src="@/assets/images/example.jpg" alt="何か">
<!-- ^^ これは間違いです -->
```

> 技術的には、`src`下の任意のディレクトリに画像を保存できます。ここで、`src/assets`は単なる推奨事項です。

### `public`ディレクトリ内

`public`ディレクトリ内に画像を保存できます。`public`ディレクトリに保存された画像はAstroによって変更されないため、最適化されず、画像最適化を自分で処理する必要があることに注意してください。

これらの画像には絶対パスを使用し、[マークダウン記法](https://www.markdownguide.org/basic-syntax/#images-1)または[HTML imgタグ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)を使用して表示できます。

例：`example.jpg`が`/public/assets/images/example.jpg`にあるとします。

```md
![何か](/assets/images/example.jpg)

<!-- または -->

<img src="/assets/images/example.jpg" alt="何か">
```

## ボーナス

### 画像圧縮

ブログ投稿に画像を配置する場合（特に`public`ディレクトリ下の画像の場合）、画像を圧縮することが推奨されます。これはウェブサイト全体のパフォーマンスに影響します。

画像圧縮サイトの私の推奨：

- [TinyPng](https://tinypng.com/)
- [TinyJPG](https://tinyjpg.com/)

### OG画像

投稿でOG画像が指定されていない場合、デフォルトのOG画像が配置されます。必須ではありませんが、投稿に関連するOG画像をフロントマターで指定する必要があります。OG画像の推奨サイズは**_1200 X 640_**pxです。

> AstroPaper v1.4.0以降、OG画像が指定されていない場合は自動生成されます。[お知らせ](https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/)をご確認ください。
