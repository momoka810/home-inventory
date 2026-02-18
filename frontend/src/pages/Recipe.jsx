import { useState } from "react";
import { api } from "../api";

export default function Recipe() {
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setRecipe("");
    try {
      const data = await api.getRecipe();
      if (data.detail) {
        setError(data.detail);
      } else {
        setRecipe(data.recipe);
      }
    } catch {
      setError("レシピの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">レシピ提案</h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
        <p className="text-slate-600 mb-4">
          現在の食材在庫をもとに、AIがレシピを提案します。
          <br />
          <span className="text-sm text-slate-400">賞味期限が近い食材を優先的に使います</span>
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "生成中..." : "レシピを提案してもらう"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {recipe && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">提案レシピ</h2>
          <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
            {recipe}
          </div>
        </div>
      )}
    </div>
  );
}
