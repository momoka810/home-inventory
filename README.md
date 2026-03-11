# おうち在庫

食材・日用品の在庫をスマホ/PCどちらからでも管理できるWebアプリ。期限切れ間近の食材を自動検出し、Claude APIが在庫に合わせたレシピをリアルタイム提案。買い物リストも自動生成します。

## デモ

https://home-inventory-rust.vercel.app

---

## 機能一覧

### ダッシュボード
- 期限まで3日以内の食材を自動アラート表示
- 残量が「少ない」日用品を一覧表示
- 全体の食材数・日用品数をサマリー表示

### 在庫管理
- **食材** — 名前・数量・賞味期限を登録。賞味期限順に表示し、期限が近いものを赤くハイライト
- **日用品** — 名前・残量レベル（多い / 普通 / 少ない）を登録・管理

### 買い物リスト
- 期限切れ間近の食材・残量が少ない日用品を自動でリストアップ
- チェックボックスで購入済み管理

### AIレシピ提案
- 登録中の食材をもとに、Claude APIがレシピを1つ提案
- 期限が近い食材を優先的に使うレシピを生成
- 材料・手順・ポイントをテキストで出力

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| バックエンド | Python 3, FastAPI, SQLAlchemy |
| データベース | SQLite |
| フロントエンド | React 19, Tailwind CSS, Vite |
| ルーティング | React Router DOM |
| AI | Claude API (claude-sonnet-4-5, Anthropic) |
| バックエンドデプロイ | Render |
| フロントエンドデプロイ | Vercel |

---

## ディレクトリ構成

```
home-inventory/
├── backend/
│   ├── main.py          # FastAPI エントリーポイント・全APIエンドポイント
│   ├── models.py        # SQLAlchemy モデル定義
│   ├── schemas.py       # Pydantic スキーマ
│   ├── database.py      # DB接続設定
│   ├── requirements.txt
│   ├── render.yaml      # Renderデプロイ設定
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js        # バックエンドAPI呼び出し
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── BottomNav.jsx  # モバイル: ボトムナビ / PC: サイドバー
    │   │   ├── pages/         # ページコンポーネント
    │   │   └── ui/            # 再利用UIコンポーネント
    │   └── pages/
    ├── package.json
    ├── vercel.json
    └── vite.config.js
```

---

## データモデル

### FoodItem（食材）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Integer | 主キー |
| name | String | 食材名 |
| quantity | Integer | 数量（デフォルト: 1） |
| expiry_date | Date | 賞味期限 |
| created_at | DateTime | 作成日時 |
| updated_at | DateTime | 更新日時 |

### SupplyItem（日用品）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Integer | 主キー |
| name | String | 日用品名 |
| stock_level | String | 残量レベル（多い / 普通 / 少ない） |
| created_at | DateTime | 作成日時 |
| updated_at | DateTime | 更新日時 |

---

## APIエンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/foods` | 食材一覧取得（賞味期限順） |
| POST | `/api/foods` | 食材追加 |
| PUT | `/api/foods/{id}` | 食材更新 |
| DELETE | `/api/foods/{id}` | 食材削除 |
| GET | `/api/supplies` | 日用品一覧取得 |
| POST | `/api/supplies` | 日用品追加 |
| PUT | `/api/supplies/{id}` | 日用品更新 |
| DELETE | `/api/supplies/{id}` | 日用品削除 |
| GET | `/api/dashboard` | ダッシュボード情報取得 |
| GET | `/api/shopping` | 買い物リスト取得 |
| POST | `/api/recipe` | AIレシピ提案（Claude API） |

---

## ローカル起動手順

### バックエンド

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .env の ANTHROPIC_API_KEY を設定
uvicorn main:app --reload
```

API が http://localhost:8000 で起動します。
APIドキュメント（Swagger UI）: http://localhost:8000/docs

### フロントエンド

```bash
cd frontend
npm install
cp .env.example .env
# .env の VITE_API_URL を確認（デフォルト: http://localhost:8000）
npm run dev
```

フロントが http://localhost:5173 で起動します。

---

## 環境変数

### バックエンド（`backend/.env`）

| 変数名 | 説明 | 例 |
|--------|------|----|
| `ANTHROPIC_API_KEY` | Claude APIキー | `sk-ant-...` |
| `ALLOWED_ORIGINS` | CORSで許可するURL | `https://your-app.vercel.app` |

### フロントエンド（`frontend/.env`）

| 変数名 | 説明 | 例 |
|--------|------|----|
| `VITE_API_URL` | バックエンドのURL | `https://your-api.onrender.com` |

---

## デプロイ構成

### バックエンド → Render

1. [Render](https://render.com) で「New Web Service」を作成
2. Root Directory を `backend` に設定
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. 環境変数を設定（`ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`）

> **注意**: Renderの無料プランは15分アイドルでスリープします。[UptimeRobot](https://uptimerobot.com)で定期pingを設定すると改善できます。

### フロントエンド → Vercel

1. [Vercel](https://vercel.com) で「New Project」を作成
2. Root Directory を `frontend`、Framework Preset を `Vite` に設定
3. 環境変数 `VITE_API_URL` にRenderのURLを設定

---

## 作者

[ATELIER MOMO](https://momoka810.github.io/portfolio/)
