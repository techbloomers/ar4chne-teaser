# ALIEN: GENESIS ティザーサイト — 引き継ぎガイド（最終版）

## ⚠️ 新しいAIセッション開始時に必ずこのファイル全体を読み込ませてください

このプロジェクトは Claude Opus が設計・実装しました。
以降の開発は Sonnet / Claude Code / Google Antigravity で行います。
**このガイドがプロジェクトの唯一の設計ドキュメントです。**

---

## プロジェクト概要

- **何**: SF ホラー映画「エイリアン」最新作（架空・未発表）のティザーサイト
- **コンセプト**: Weyland-Yutani社の端末にアクセスしてしまった体験
- **世界観の参照元**: Alien (1979) 〜 Alien: Romulus (2024) のCRT/アナログUI美学
- **技術構成**: HTML / CSS / JavaScript（複数ファイル構成）
- **外部依存**: Google Fonts CDN + GSAP CDN のみ
- **ホスティング**: GitHub Pages
- **対象ブラウザ**: Chrome, Safari, Firefox（PC + スマホ）

---

## 4つの設計原則（全作業で守ること）

1. **抑制の美学**: すべての演出は70%の強度。エイリアンの恐怖は「見せない怖さ」。フリッカーは薄く、グリッチは稀に、パーティクルは少なく
2. **プログレッシブ・エンハンスメント**: エフェクトなしでもコンテンツが読めること。モバイルでは重い演出を自動OFF。`prefers-reduced-motion` を尊重
3. **8秒ルール**: ブートシーケンスは最大8秒。SKIPボタンあり。ユーザーを待たせすぎない
4. **カラーシフト**: amber（コロニー端末）→ blue（ステーション）→ red（警告）でセクションの「場所」が変わる

---

## プロジェクト構成

```
alien-teaser/
├── index.html                ← HTML構造のみ（インラインCSS/JSなし）
├── css/
│   └── style.css             ← 全スタイル
├── js/
│   ├── effects.js            ← テキストスクランブル、グリッチ（共有ユーティリティ）
│   ├── particles.js          ← Canvas星空（独立・削除可）
│   ├── audio.js              ← Web Audio APIドローン音（独立・削除可）
│   ├── easter-egg.js         ← 隠しコマンド（独立・削除可）
│   └── main.js               ← ブート/ヒーロー/GSAP/カウントダウン（最後に読み込む）
├── assets/                   ← ★ 素材はすべてここに配置
│   ├── images/               ← 画像素材（WebP, PNG）
│   ├── svg/                  ← ロゴ・アイコン（SVG）
│   ├── video/                ← 映像素材（MP4）
│   └── audio/                ← 効果音素材（MP3, OGG）
├── IMPLEMENTATION_GUIDE.md   ← このファイル
└── README.md                 ← GitHub用
```

---

## 実装済み機能（全7つ完了）

| # | 機能 | ファイル | 独立性 |
|---|---|---|---|
| ❶ | ブートシーケンス | js/main.js | — |
| ❷ | CRT + スキャンライン + グレイン + ビネット | css/style.css | — |
| ❸ | テキストスクランブル + ヒーロー演出 | js/effects.js + main.js | — |
| ❹ | GSAP ScrollTrigger | js/main.js | GSAPなしでもフォールバック |
| ❺ | Web Audio API アンビエント | js/audio.js | 完全独立。削除可 |
| ❻ | パーティクル星空 | js/particles.js | 完全独立。削除可 |
| ❼ | イースターエッグ | js/easter-egg.js | 完全独立。削除可 |

---

## JS読み込み順序（変更禁止）

```html
<script src="js/effects.js" defer></script>      ← 最初
<script src="js/audio.js" defer></script>         ← 順不同
<script src="js/particles.js" defer></script>     ← 順不同
<script src="js/easter-egg.js" defer></script>    ← 順不同
<script src="js/main.js" defer></script>          ← 必ず最後
```

---

## やってはいけないこと

1. main.js を effects.js より先に読み込まない
2. z-index の序列を壊さない（CRTオーバーレイ 9999 が最前面）
3. CDN バージョンを変えない（GSAP 3.12.5 検証済み）
4. `.gs-h` クラス名を変えない（JS全体で参照）
5. ブートシーケンスを8秒以上にしない

---

# 素材活用ガイド（Sonnet向け）

ここからが本題です。マルチファイル構成により、以下の素材を活用できます。

---

## 1. タイトルロゴ（SVG）

### 作り方
**Illustratorの場合：**
- 「ALIEN」「GENESIS」のテキストをアウトライン化
- エイリアンフランチャイズ風のフォント参考: Nostromo（有料）、Microgramma（有料）、またはフリーの Orbitron / Rajdhani
- 文字のパスを個別に書き出し（SVGパスアニメーション用）
- 書き出し: ファイル → 書き出し → SVG → 「テキストをアウトライン」にチェック

**Figmaの場合：**
- テキストをフレーム内に配置 → 右クリック → フレームを選択状態でエクスポート → SVG

### 配置場所
`assets/svg/logo-title.svg`

### HTMLへの組み込み方
```html
<!-- index.html の #section-hero 内、hero-subtitle の下に追加 -->
<img src="assets/svg/logo-title.svg" alt="ALIEN: GENESIS" class="hero-logo">
```

### CSSの追加（style.css）
```css
.hero-logo {
  width: clamp(200px, 40vw, 500px);
  margin-bottom: 1em;
  opacity: 0;
  transition: opacity 1.5s ease;
  /* CRTの雰囲気に合うフィルター */
  filter: drop-shadow(0 0 15px var(--primary-glow));
}

.hero-logo.visible {
  opacity: 1;
}
```

### AIへの指示プロンプト
```
index.html の #section-hero 内に、hero-subtitle の直後にロゴ画像を追加してください。
<img src="assets/svg/logo-title.svg" alt="ALIEN: GENESIS" class="hero-logo gs-h">
css/style.css に .hero-logo クラスのスタイルを追加してください。
width: clamp(200px, 40vw, 500px), filter: drop-shadow で amber glow を付けてください。
js/main.js の startHeroSequence 内で、ロゴの gs-h を解除して表示する処理を
タイトルスクランブルの前（setTimeout 500ms あたり）に追加してください。
```

---

## 2. Weyland-Yutani ロゴ（SVG）

### 作り方
Weyland-Yutani の架空の社章を作成。参考: 映画に登場するW-Yロゴは二重のWをモチーフにしたもの。
- 独自デザインで作成（著作権の観点から公式ロゴそのものは使わない）
- シンプルな幾何学的デザインが端末UIに合う

### 配置場所
`assets/svg/logo-wy.svg`

### 使用箇所
- ブートシーケンス画面の左上
- フッターセクション

### AIへの指示プロンプト
```
ブートシーケンスのboot-log の上にWeyland-Yutaniロゴを追加してください。
<img src="assets/svg/logo-wy.svg" alt="WY" class="boot-logo">
サイズは height: 30px, opacity: 0.6, margin-bottom: 1.5em で。
フッターにも同じロゴを小さく（height: 20px）配置してください。
```

---

## 3. キービジュアル画像（WebP / PNG）

### 作り方
**AI生成（Midjourney / DALL-E / Stable Diffusion）の場合：**

推奨プロンプト集（英語で入力）:

ヒーロー背景用:
```
dark deep space, distant stars, faint amber nebula, extremely dark and minimal, 
cinematic 2.39:1 aspect ratio, no text, no characters, alien movie aesthetic, 
volumetric fog, 8k --ar 21:9
```

ティザービジュアル用:
```
dark spaceship corridor, single flickering amber CRT monitor on wall, 
fog, wet metal floor, alien 1979 aesthetic, lo-fi sci-fi, no characters, 
cinematic horror lighting --ar 16:9
```

ゼノモーフのシルエット用:
```
xenomorph silhouette in darkness, backlit by single blue emergency light, 
fog, wet surfaces, extremely dark, only outline visible, 
horror movie still, alien franchise aesthetic --ar 16:9
```

**Photoshopでの加工:**
- 画像全体を暗くする（レベル補正で出力を 0-60 に制限）
- ノイズを追加（フィルター → ノイズ → 量: 3-5%, ガウス分布）
- ビネット追加（レンズ補正フィルター → ビネット: -80）
- WebP形式で書き出し（品質: 75-80%、ファイルサイズを500KB以下に）

### 配置場所
```
assets/images/hero-bg.webp       ← ヒーロー背景
assets/images/corridor.webp      ← セクション背景（任意）
assets/images/silhouette.webp    ← 警告セクション用（任意）
```

### HTMLへの組み込みパターン

**パターンA: ヒーローセクションの背景画像**
```html
<!-- index.html: #section-hero にクラス追加 -->
<section class="section hero has-bg" id="section-hero">
```

**CSSの追加:**
```css
.hero.has-bg {
  background: url('../assets/images/hero-bg.webp') center center / cover no-repeat;
  background-color: var(--bg); /* 画像読み込み前のフォールバック */
}

/* 画像の上にダークオーバーレイ（テキストの可読性確保） */
.hero.has-bg::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(10, 10, 10, 0.7); /* 70%の黒オーバーレイ */
  z-index: 0;
}

/* テキストをオーバーレイの上に */
.hero.has-bg > * {
  position: relative;
  z-index: 1;
}
```

**パターンB: 独立した画像要素として配置**
```html
<img src="assets/images/silhouette.webp" alt="" class="reveal-image gs-h" loading="lazy">
```

### AIへの指示プロンプト
```
#section-hero に背景画像を追加してください。
index.html: section に has-bg クラスを追加
css/style.css: .hero.has-bg に background 指定
  - 画像パス: assets/images/hero-bg.webp
  - center center / cover
  - ::after で rgba(10,10,10,0.7) のダークオーバーレイ
  - 子要素は z-index: 1 でオーバーレイの上に
  - 画像読み込み前のフォールバック色: var(--bg)
```

---

## 4. 背景映像ループ（MP4）

### 概要
ヒーロー背景を静止画ではなく、暗い宇宙空間のゆっくり動く映像にする。
短いループ映像（5-15秒）で、コンテンツの邪魔にならない控えめなもの。

### 作り方
- AI映像生成（Runway, Pika, Kling 等）で暗い宇宙空間の映像を生成
- または After Effects でパーティクル＋星雲のゆっくりした動きを作成
- 解像度: 1920x1080 で十分（それ以上は重い）
- ファイルサイズ: 2-5MB 以下に圧縮（HandBrake等で）
- 音声なし（muted）

推奨AIプロンプト:
```
slow moving dark nebula in deep space, very subtle movement, 
extremely dark background with faint amber and blue tones, 
cinematic, no stars, minimal, perfect loop, 10 seconds
```

### 配置場所
`assets/video/hero-bg.mp4`

### HTMLへの組み込み
```html
<!-- index.html: #section-hero の先頭に追加 -->
<section class="section hero" id="section-hero">
  <video class="hero-video" autoplay muted loop playsinline>
    <source src="assets/video/hero-bg.mp4" type="video/mp4">
  </video>
  <!-- 既存のコンテンツ... -->
</section>
```

### CSSの追加
```css
.hero-video {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.25; /* 原則1: 抑制 — かなり暗くする */
  pointer-events: none;
}

/* テキストを映像の上に */
.hero > *:not(.hero-video) {
  position: relative;
  z-index: 1;
}

/* モバイルでは映像を非表示（パフォーマンス対策） */
@media (max-width: 768px) {
  .hero-video {
    display: none;
  }
}
```

### AIへの指示プロンプト
```
#section-hero に背景映像を追加してください。
1. index.html: section の先頭に <video class="hero-video" autoplay muted loop playsinline> を追加
   ソース: assets/video/hero-bg.mp4
2. css/style.css に .hero-video スタイルを追加:
   - position: absolute, cover全体
   - opacity: 0.25（非常に暗く）
   - z-index: 0
3. 他のhero内要素は z-index: 1 で映像の上に
4. モバイル(768px以下)では display: none
5. prefers-reduced-motion では display: none
```

---

## 5. 効果音ファイル（MP3 / OGG）

### 概要
現在のWeb Audio API合成音に加えて、実際の効果音ファイルを使うことで
リアリティが大幅に向上する。

### 推奨する効果音

| ファイル名 | 用途 | タイミング |
|---|---|---|
| boot-beep.mp3 | ブートシーケンスのビープ音 | 各行表示時 |
| door-hiss.mp3 | セクション遷移時の気密ドアの音 | スクロールでセクション切替時 |
| alarm.mp3 | 警告セクション表示時 | 警告セクションScrollTrigger発火時 |
| static.mp3 | ノイズ/静電気音 | グリッチ発火時 |

### 入手方法
- freesound.org（無料、要帰属表示）で「sci-fi beep」「door hiss」「alarm klaxon」検索
- 自作: Audacityで合成音を録音、エフェクト追加
- AI生成: ElevenLabsのSound Effects等

### 配置場所
```
assets/audio/boot-beep.mp3
assets/audio/door-hiss.mp3
assets/audio/alarm.mp3
assets/audio/static.mp3
```

### 組み込み方法
`js/audio.js` に効果音再生機能を追加する。

### AIへの指示プロンプト
```
js/audio.js に効果音再生機能を追加してください。
以下の関数を追加:

1. playSFX(filename) — assets/audio/ 内のファイルを1回再生する関数
   - 音量: 0.3（控えめ）
   - Audio要素を使用（Web Audio APIのコンテキストとは別でOK）

2. js/main.js のブートシーケンスの各行表示時に
   playSFX('boot-beep.mp3') を呼ぶ

3. 警告セクションのScrollTrigger発火時に
   playSFX('alarm.mp3') を呼ぶ

注意: サウンドボタンがOFFの場合は効果音も鳴らさないこと。
グローバルに window.AlienAudio = { muted: true } のようなフラグを用意し、
サウンドボタンのON/OFFと連動させてください。
```

---

## 6. SVGパスアニメーション（ロゴの描画演出）

### 概要
SVGのロゴが「1本の線で描かれていく」演出。エンジニアの"おっ"度が高い。

### 前提条件
ロゴがSVGの `<path>` 要素で構成されていること（Illustratorでアウトライン化→SVG書き出しすれば自然にそうなる）。

### CSSでの実装方法
```css
/* ロゴの各pathに適用 */
.logo-path {
  stroke-dasharray: 1000; /* パスの全長（実際の値はJS計算 or 試行錯誤で調整） */
  stroke-dashoffset: 1000;
  animation: draw-path 2s ease forwards;
  fill: none;
  stroke: var(--primary);
  stroke-width: 1;
}

@keyframes draw-path {
  to {
    stroke-dashoffset: 0;
  }
}
```

### AIへの指示プロンプト
```
assets/svg/logo-title.svg のSVGパスにアニメーションを追加してください。
1. SVGファイルをindex.htmlにインラインで埋め込む（imgタグではなくSVGタグ直接）
2. 各 <path> 要素に logo-path クラスを付与
3. css/style.css に stroke-dasharray/stroke-dashoffset アニメーションを追加
4. js/main.js の startHeroSequence 内でアニメーション発火
5. アニメーション完了後にfillをvar(--primary)にフェードイン
```

---

## 7. ファビコン

### 作り方
32x32px の小さなアイコン。Weyland-Yutaniロゴのシンプル版や、ゼノモーフの頭部シルエットなど。

### 配置
`assets/favicon.ico` または `assets/favicon.svg`

### HTMLへの追加
```html
<!-- index.html <head> 内に追加 -->
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
```

---

## 素材制作の優先順位

全てを作る必要はありません。効果が大きい順：

| 優先度 | 素材 | 効果 | 作成難度 |
|---|---|---|---|
| ★★★ | タイトルロゴ SVG | サイトの顔が変わる | Figma/Illustratorで30分 |
| ★★★ | ファビコン | プロっぽさの最低限 | 5分 |
| ★★☆ | ヒーロー背景画像 | 奥行きが出る | AI生成+Photoshop加工15分 |
| ★★☆ | W-Yロゴ SVG | 世界観の説得力 | Figma/Illustratorで20分 |
| ★☆☆ | 背景映像ループ | 圧倒的没入感 | AI映像生成+圧縮30分 |
| ★☆☆ | 効果音ファイル | リアリティ向上 | freesound.orgで収集15分 |
| ☆☆☆ | SVGパスアニメ | エンジニア評価 | ロゴSVG完成後に追加 |

**最低限やるべき: ロゴSVG + ファビコン。** この2つだけで「テキストだけのサイト」から「デザインされたサイト」に変わります。

---

## GitHub Pages デプロイ時の注意

### パスの問題
GitHub Pages ではリポジトリ名がURLのサブディレクトリになる場合があります：
`https://username.github.io/alien-teaser/`

全ての素材パスは **相対パス** で書いてあるので問題ないはずですが、
もし画像が表示されない場合は以下を確認：
- パスの大文字/小文字が実際のファイル名と一致しているか（GitHubは大文字小文字を区別する）
- assets/ フォルダがgitにcommitされているか（空フォルダはgitに入らない）

### ファイルサイズの目安
GitHub Pages の上限は1リポジトリ1GBですが、表示速度の観点で：
- 画像: 各500KB以下（WebP推奨）
- 映像: 5MB以下
- 音声: 各200KB以下
- 全体: 10MB以下を目標

---

## 今後の拡張候補（余裕があれば）

### 複数ページ化
現在は1ページ完結ですが、ファイル構成を活かして：
- `index.html` — メインティザー（現在のもの）
- `terminal.html` — 隠しターミナルページ（イースターエッグから遷移）
- `dossier.html` — 映画のキャラクター資料風ページ

### CSSの分割
style.css が大きくなりすぎたら：
```
css/
├── base.css        ← リセット、変数、ベース
├── crt.css         ← CRTエフェクト
├── sections.css    ← セクション別スタイル
├── animations.css  ← キーフレーム定義
└── responsive.css  ← メディアクエリ
```
index.html で順に読み込む。

### OGP / SNSシェア対応
```html
<meta property="og:title" content="ALIEN: GENESIS — CLASSIFIED">
<meta property="og:description" content="In space, no one can hear you scream.">
<meta property="og:image" content="assets/images/og-image.webp">
<meta property="og:type" content="website">
```
1200x630px のOG画像を `assets/images/og-image.webp` に配置。

---

## トラブルシューティング

### CSSやJSが読み込まれない
- ファイルをダブルクリックではなく、Live ServerやHTTPサーバー経由で開いているか
- パスが正しいか（`css/style.css` であって `./css/style.css` や `/css/style.css` ではなく）

### GSAPが動かない
- CDNがブロックされていないか（社内ネットワーク等）
- main.js 内のフォールバック処理で `.gs-h` が全部表示される設計になっている

### 音が鳴らない
- ユーザーのクリック（ジェスチャー）なしにブラウザは音を再生しない
- iOS: `audioCtx.resume()` が必要（実装済み）

### パーティクルが重い
- particles.js の PARTICLE_COUNT を減らす

### 画像が表示されない
- パスの大文字/小文字を確認（Windowsでは区別しないがGitHub Pagesは区別する）
- 画像ファイルが実際にcommitされているか `git status` で確認

---

## AI活用のベストプラクティス

### Sonnet / Claude Code に指示するときのコツ

1. **ファイル名を明示する**: 「style.cssのヒーローセクションのフォントサイズを変えて」
2. **変更範囲を限定する**: 「他のセクションは触らないで」
3. **既存のパターンを参照させる**: 「トランスミッションセクションと同じ構造で新セクションを追加して」
4. **確認方法も指示する**: 「変更後、Live Serverで確認してスクリーンショットを見せて」

### Google Antigravity での作業フロー
1. ファイルを指定して開く
2. 変更内容を自然言語で指示
3. Live Previewで確認
4. 問題があれば「元に戻して」で修正

### Claude Code での作業フロー
1. `cat IMPLEMENTATION_GUIDE.md` で設計ドキュメント確認
2. 変更対象ファイルを指定してコード修正
3. `npx serve .` でローカルサーバー起動
4. ブラウザで確認
