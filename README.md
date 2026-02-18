# 家庭用在庫管理 Web アプリ

食材・日用品の在庫をスマホ/PCどちらからでも管理できるWebアプリです。

## 機能

- **ダッシュボード** - 期限切れ間近の食材・残量が少ない日用品を一覧表示
- **在庫管理** - 食材（名前・数量・賞味期限）と日用品（名前・残量レベル）のCRUD
- **買い物リスト** - 不足品を自動リストアップ、チェックボックスで購入済み管理
- **レシピ提案** - Claude APIが在庫をもとにレシピを提案（期限が近い食材を優先）

## 技術スタック

- バックエンド: Python + FastAPI + SQLite (SQLAlchemy)
- フロントエンド: React + Tailwind CSS (Vite)
- AI: Claude API (claude-sonnet-4-5-20250929)

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

### フロントエンド

```bash
cd frontend
npm install
cp .env.example .env
# .env の VITE_API_URL を確認（デフォルト: http://localhost:8000）
npm run dev
```

フロントが http://localhost:5173 で起動します。

## デプロイ手順

### バックエンド → Render

1. GitHubにリポジトリをpush
2. [Render](https://render.com) で「New Web Service」を作成
3. リポジトリを接続し、Root Directory を `backend` に設定
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. 環境変数を設定:
   - `ANTHROPIC_API_KEY`: Claude APIキー
   - `ALLOWED_ORIGINS`: Vercelのフロントエンド URL（例: `https://your-app.vercel.app`）

### フロントエンド → Vercel

1. [Vercel](https://vercel.com) で「New Project」を作成
2. リポジトリを接続し、Root Directory を `frontend` に設定
3. Framework Preset: Vite
4. 環境変数を設定:
   - `VITE_API_URL`: RenderのバックエンドURL（例: `https://your-api.onrender.com`）

## 画面構成

| パス | 画面 |
|------|------|
| `/` | ダッシュボード |
| `/inventory` | 在庫一覧・追加・編集 |
| `/shopping` | 買い物リスト |
| `/recipe` | レシピ提案 |
