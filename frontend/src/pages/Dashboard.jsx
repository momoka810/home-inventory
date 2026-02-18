import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-slate-500 py-8">読み込み中...</p>;

  const { expiring_foods = [], low_supplies = [] } = data || {};
  const hasAlerts = expiring_foods.length > 0 || low_supplies.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">ダッシュボード</h1>

      {!hasAlerts && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-700 text-lg font-medium">すべて問題ありません！</p>
          <p className="text-green-600 text-sm mt-1">期限切れ間近の食材や不足品はありません</p>
        </div>
      )}

      {expiring_foods.length > 0 && (
        <section className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-red-700 mb-3">
            期限3日以内の食材 ({expiring_foods.length}件)
          </h2>
          <ul className="space-y-2">
            {expiring_foods.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm"
              >
                <div>
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <span className="text-sm text-slate-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="text-sm text-red-600 font-medium">{item.expiry_date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {low_supplies.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-amber-700 mb-3">
            残量が少ない日用品 ({low_supplies.length}件)
          </h2>
          <ul className="space-y-2">
            {low_supplies.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm"
              >
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="text-sm text-amber-600 font-medium">少ない</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
