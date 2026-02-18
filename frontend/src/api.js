const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (options.method === "DELETE") return null;
  return res.json();
}

export const api = {
  getFoods: () => request("/api/foods"),
  createFood: (data) => request("/api/foods", { method: "POST", body: JSON.stringify(data) }),
  updateFood: (id, data) => request(`/api/foods/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFood: (id) => request(`/api/foods/${id}`, { method: "DELETE" }),

  getSupplies: () => request("/api/supplies"),
  createSupply: (data) => request("/api/supplies", { method: "POST", body: JSON.stringify(data) }),
  updateSupply: (id, data) => request(`/api/supplies/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSupply: (id) => request(`/api/supplies/${id}`, { method: "DELETE" }),

  getDashboard: () => request("/api/dashboard"),
  getShopping: () => request("/api/shopping"),
  getRecipe: () => request("/api/recipe", { method: "POST" }),
};
