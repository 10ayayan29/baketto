# Bucket List App

シンプルで使いやすい共同編集バケットリストアプリです。URLを共有するだけで、友達と一緒にやりたいことリストを作成・管理できます。

## 特徴

- URLベースの共有（URLを知っている人全員が編集可能）
- リアルタイム同期（複数人が同時に編集しても即座に反映）
- メンバー管理（誰が何を追加したかを記録）
- 完了チェック機能
- メモ機能（各項目に詳細を追加可能）
- シンプルで直感的なUI

## 技術スタック

- **フロントエンド**: Nuxt.js 3 + TypeScript + Vue 3
- **バックエンド/データベース**: Supabase (PostgreSQL + Realtime)
- **スタイリング**: SCSS (カスタムスタイル)

## 必要な環境

- Node.js 18.x 以上
- npm または yarn
- Supabaseアカウント

## セットアップ手順

### 1. プロジェクトのクローンとインストール

```bash
cd bucket-list-app
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下の情報を取得:
   - Project URL
   - Anon/Public Key

### 3. データベーススキーマの作成

1. SupabaseのダッシュボードでSQL Editorを開く
2. `supabase-schema.sql`の内容をコピー&ペーストして実行
3. 以下のテーブルが作成されます:
   - `buckets`: バケットリスト
   - `members`: メンバー管理
   - `bucket_items`: バケットリスト項目

### 4. 環境変数の設定

`.env.example`をコピーして`.env`を作成:

```bash
cp .env.example .env
```

`.env`ファイルに取得したSupabaseの情報を設定:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリを確認できます。

## 使い方

### 新しいバケットリストを作成

1. トップページでタイトルを入力
2. メンバー名を入力して「追加」ボタンをクリック（最低1人必要）
3. 必要に応じて複数のメンバーを追加
4. 「作成」ボタンをクリック
5. 自動的に詳細ページに遷移します

### バケットリストに項目を追加

1. 詳細ページ上部のフォームでタイトルを入力
2. プルダウンから担当者を選択（新しいメンバーも追加可能）
3. 必要に応じてメモを入力
4. 「追加」ボタンをクリック

### その他の機能

- **完了チェック**: チェックボックスをクリックすると完了済みセクションに移動
- **メモ表示**: ℹ️ボタンをクリックでメモを表示
- **削除**: ゴミ箱アイコンで項目を削除
- **リアルタイム同期**: 複数のブラウザ/タブで同じリストを開くと自動で同期

## プロジェクト構造

```
bucket-list-app/
├── components/          # Vueコンポーネント
│   ├── BucketItem.vue              # 個別項目表示
│   ├── BucketItemForm.vue          # 項目追加フォーム
│   ├── CompletedSection.vue        # 完了済みアコーディオン
│   ├── MemberInput.vue             # メンバー追加入力
│   ├── MemberSelector.vue          # メンバー選択プルダウン
│   ├── InfoDialog.vue              # メモ表示ダイアログ
│   └── BucketListCard.vue          # バケットリストカード
├── composables/         # Vue Composables (状態管理・ロジック)
│   ├── useSupabase.ts              # Supabaseクライアント
│   ├── useBucketList.ts            # バケットリスト操作
│   ├── useBucketItems.ts           # アイテムCRUD
│   ├── useMembers.ts               # メンバー管理
│   └── useRealtimeSync.ts          # リアルタイム同期
├── pages/               # ページコンポーネント
│   ├── index.vue                   # トップページ
│   └── bucket/[id].vue             # バケットリスト詳細
├── types/               # TypeScript型定義
│   └── index.ts
├── utils/               # ユーティリティ
│   └── constants.ts                # 定数（カラーパレット）
├── assets/
│   └── styles/
│       └── main.scss               # グローバルスタイル
├── nuxt.config.ts       # Nuxt設定
├── package.json
├── tsconfig.json
└── supabase-schema.sql  # データベーススキーマ
```

## ビルドとデプロイ

### プロダクションビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

### デプロイ

このアプリはVercelやNetlifyなどの静的ホスティングサービスに簡単にデプロイできます。

**Vercelの場合:**

```bash
npm install -g vercel
vercel
```

環境変数（`SUPABASE_URL`、`SUPABASE_KEY`）をデプロイ先の設定で追加してください。

## セキュリティに関する注意

- このアプリはURLを知っている人全員が編集できる設計です
- 機密情報や個人情報はメモに入れないようにしてください
- anon keyは公開されても問題ありません（フロントエンド用の公開鍵です）
- Row Level Security (RLS)で全アクセスを許可しているため、データベースレベルでの制限はありません

## トラブルシューティング

### リアルタイム同期が動作しない

1. SupabaseのダッシュボードでRealtimeが有効になっているか確認
2. `supabase-schema.sql`の最後の部分（ALTER PUBLICATION）が実行されているか確認
3. ブラウザのコンソールでWebSocket接続エラーがないか確認

### データベースエラーが発生する

1. `supabase-schema.sql`が正しく実行されているか確認
2. RLSポリシーが正しく設定されているか確認
3. Supabaseの環境変数が正しく設定されているか確認

## ライセンス

このプロジェクトは個人利用・商用利用ともに自由に使用できます。

## 今後の拡張予定

- インライン編集機能
- ドラッグ&ドロップでの並び替え
- 画像アップロード機能
- バケットリストのアーカイブ
- 検索・フィルター機能
- PWA対応
- ダークモード
