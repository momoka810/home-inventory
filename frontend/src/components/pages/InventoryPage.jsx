import { useEffect, useState } from 'react';
import { api } from '../../api';
import FoodCard from '../ui/FoodCard';
import DailyCard from '../ui/DailyCard';
import styles from './InventoryPage.module.css';

function FoodForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [quantity, setQuantity] = useState(initial?.quantity || 1);
  const [expiryDate, setExpiryDate] = useState(initial?.expiry_date || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, quantity: Number(quantity), expiry_date: expiryDate });
    if (!initial) { setName(''); setQuantity(1); setExpiryDate(''); }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input type="text" placeholder="食材名" required value={name}
        onChange={(e) => setName(e.target.value)} className={styles.input} />
      <div className={styles.formRow}>
        <input type="number" min="1" required value={quantity}
          onChange={(e) => setQuantity(e.target.value)} className={`${styles.input} ${styles.inputSmall}`} placeholder="数量" />
        <input type="date" required value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)} className={styles.input} />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn}>
          {initial ? '更新する' : '追加する'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>キャンセル</button>
        )}
      </div>
    </form>
  );
}

function SupplyForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [stockLevel, setStockLevel] = useState(initial?.stock_level || '普通');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, stock_level: stockLevel });
    if (!initial) { setName(''); setStockLevel('普通'); }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input type="text" placeholder="日用品名" required value={name}
        onChange={(e) => setName(e.target.value)} className={styles.input} />
      <select value={stockLevel} onChange={(e) => setStockLevel(e.target.value)} className={styles.input}>
        <option value="多い">多い</option>
        <option value="普通">普通</option>
        <option value="少ない">少ない</option>
      </select>
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn}>
          {initial ? '更新する' : '追加する'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>キャンセル</button>
        )}
      </div>
    </form>
  );
}

export default function InventoryPage() {
  const [tab, setTab] = useState('food');
  const [foods, setFoods] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const reload = () => {
    api.getFoods().then(setFoods);
    api.getSupplies().then(setSupplies);
    setEditingItem(null);
    setShowForm(false);
  };

  useEffect(() => { reload(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm('削除しますか？')) return;
    if (tab === 'food') api.deleteFood(id).then(reload);
    else api.deleteSupply(id).then(reload);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingItem) {
      const updateFn = tab === 'food' ? api.updateFood : api.updateSupply;
      updateFn(editingItem.id, data).then(reload);
    } else {
      const createFn = tab === 'food' ? api.createFood : api.createSupply;
      createFn(data).then(reload);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'food' ? styles.tabActive : ''}`}
          onClick={() => { setTab('food'); setShowForm(false); setEditingItem(null); }}
        >
          🥬 食材
        </button>
        <button
          className={`${styles.tab} ${tab === 'supply' ? styles.tabActive : ''}`}
          onClick={() => { setTab('supply'); setShowForm(false); setEditingItem(null); }}
        >
          📦 日用品
        </button>
      </div>

      {showForm && (
        <div className={`${styles.formCard} fade-in`}>
          <h3 className={styles.formTitle}>
            {editingItem ? '編集' : '新規追加'}
          </h3>
          {tab === 'food' ? (
            <FoodForm
              initial={editingItem}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
            />
          ) : (
            <SupplyForm
              initial={editingItem}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
            />
          )}
        </div>
      )}

      <div className={styles.list}>
        {tab === 'food' && foods.map((item) => (
          <FoodCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {tab === 'supply' && supplies.map((item) => (
          <DailyCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {tab === 'food' && foods.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🥗</span>
            <p>食材が登録されていません</p>
          </div>
        )}
        {tab === 'supply' && supplies.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📦</span>
            <p>日用品が登録されていません</p>
          </div>
        )}
      </div>

      {!showForm && (
        <button className={styles.fab} onClick={() => { setShowForm(true); setEditingItem(null); }}>
          ＋
        </button>
      )}
    </div>
  );
}
