import { useEffect, useState } from "react";
import { api } from "../api";

export default function Shopping() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getShopping().then((data) => setItems(data.items || [])).finally(() => setLoading(false));
  }, []);

  const toggle = (index) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) return <p className="text-center text-slate-500 py-8">読み込み中...</p>;

  const uncheckedCount = items.filter((_, i) => !checked[i]).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">買い物リスト</h1>
        {items.length > 0 && (
          <span className="text-sm text-slate-500">残り {uncheckedCount}件</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-700 font-medium">買い物リストは空です</p>
          <p className="text-green-600 text-sm mt-1">不足品や期限切れ間近の食材はありません</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => toggle(index)}
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                checked[index] ? "border-slate-200 opacity-50" : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <input
                type="checkbox"
                checked={!!checked[index]}
                onChange={() => toggle(index)}
                className="w-5 h-5 rounded accent-blue-600"
              />
              <div className="flex-1">
                <span className={`font-medium ${checked[index] ? "line-through text-slate-400" : "text-slate-800"}`}>
                  {item.name}
                </span>
                <span className="text-sm text-slate-500 ml-3">{item.detail}</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.type === "food" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.type === "food" ? "食材" : "日用品"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
