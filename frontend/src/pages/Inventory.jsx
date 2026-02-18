import { useEffect, useState } from "react";
import { api } from "../api";

function FoodForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [quantity, setQuantity] = useState(initial?.quantity || 1);
  const [expiryDate, setExpiryDate] = useState(initial?.expiry_date || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, quantity: Number(quantity), expiry_date: expiryDate });
    if (!initial) { setName(""); setQuantity(1); setExpiryDate(""); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <input
        type="text" placeholder="食材名" required value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px]"
      />
      <input
        type="number" min="1" required value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-20"
      />
      <input
        type="date" required value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
        {initial ? "更新" : "追加"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm">
          キャンセル
        </button>
      )}
    </form>
  );
}

function SupplyForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [stockLevel, setStockLevel] = useState(initial?.stock_level || "普通");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, stock_level: stockLevel });
    if (!initial) { setName(""); setStockLevel("普通"); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <input
        type="text" placeholder="日用品名" required value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px]"
      />
      <select
        value={stockLevel} onChange={(e) => setStockLevel(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="多い">多い</option>
        <option value="普通">普通</option>
        <option value="少ない">少ない</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
        {initial ? "更新" : "追加"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm">
          キャンセル
        </button>
      )}
    </form>
  );
}

const stockColors = {
  "多い": "bg-green-100 text-green-700",
  "普通": "bg-blue-100 text-blue-700",
  "少ない": "bg-red-100 text-red-700",
};

export default function Inventory() {
  const [tab, setTab] = useState("food");
  const [foods, setFoods] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const reload = () => {
    api.getFoods().then(setFoods);
    api.getSupplies().then(setSupplies);
    setEditingId(null);
  };

  useEffect(() => { reload(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">在庫管理</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("food")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "food" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          食材
        </button>
        <button
          onClick={() => setTab("supply")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "supply" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          日用品
        </button>
      </div>

      {tab === "food" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-3">食材を追加</h2>
            <FoodForm onSubmit={(data) => api.createFood(data).then(reload)} />
          </div>

          <div className="space-y-2">
            {foods.map((item) =>
              editingId === item.id ? (
                <div key={item.id} className="bg-white rounded-xl border border-blue-300 p-4">
                  <FoodForm
                    initial={item}
                    onSubmit={(data) => api.updateFood(item.id, data).then(reload)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 flex justify-between items-center ${
                    item.is_expiring_soon ? "border-red-300 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <div>
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-sm text-slate-500 ml-2">x{item.quantity}</span>
                    <span className={`text-sm ml-3 ${item.is_expiring_soon ? "text-red-600 font-medium" : "text-slate-500"}`}>
                      期限: {item.expiry_date}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(item.id)} className="text-sm text-blue-600 hover:text-blue-800">編集</button>
                    <button onClick={() => api.deleteFood(item.id).then(reload)} className="text-sm text-red-600 hover:text-red-800">削除</button>
                  </div>
                </div>
              )
            )}
            {foods.length === 0 && <p className="text-center text-slate-400 py-4">食材が登録されていません</p>}
          </div>
        </div>
      )}

      {tab === "supply" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-3">日用品を追加</h2>
            <SupplyForm onSubmit={(data) => api.createSupply(data).then(reload)} />
          </div>

          <div className="space-y-2">
            {supplies.map((item) =>
              editingId === item.id ? (
                <div key={item.id} className="bg-white rounded-xl border border-blue-300 p-4">
                  <SupplyForm
                    initial={item}
                    onSubmit={(data) => api.updateSupply(item.id, data).then(reload)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 flex justify-between items-center ${
                    item.is_low ? "border-red-300 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${stockColors[item.stock_level]}`}>
                      {item.stock_level}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(item.id)} className="text-sm text-blue-600 hover:text-blue-800">編集</button>
                    <button onClick={() => api.deleteSupply(item.id).then(reload)} className="text-sm text-red-600 hover:text-red-800">削除</button>
                  </div>
                </div>
              )
            )}
            {supplies.length === 0 && <p className="text-center text-slate-400 py-4">日用品が登録されていません</p>}
          </div>
        </div>
      )}
    </div>
  );
}
