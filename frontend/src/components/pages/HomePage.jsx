import { useEffect, useState } from 'react';
import { api } from '../../api';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [allSupplies, setAllSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getFoods(), api.getSupplies()])
      .then(([dash, foods, supplies]) => {
        setData(dash);
        setAllFoods(foods);
        setAllSupplies(supplies);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  const { expiring_foods = [], low_supplies = [] } = data || {};
  const alertCount = expiring_foods.length + low_supplies.length;

  return (
    <div className={styles.page}>
      {alertCount > 0 && (
        <div className={`${styles.alertBanner} fade-in`}>
          <span className={styles.alertIcon}>⚠️</span>
          <span>注意が必要なアイテムが <strong>{alertCount}件</strong> あります</span>
        </div>
      )}

      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.cardTerracotta} fade-in`}>
          <span className={styles.summaryValue}>{expiring_foods.length}</span>
          <span className={styles.summaryLabel}>期限3日以内</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardAmber} fade-in`}>
          <span className={styles.summaryValue}>{low_supplies.length}</span>
          <span className={styles.summaryLabel}>残り少ない</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardSage} fade-in`}>
          <span className={styles.summaryValue}>{allFoods.length}</span>
          <span className={styles.summaryLabel}>食材数</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardBark} fade-in`}>
          <span className={styles.summaryValue}>{allSupplies.length}</span>
          <span className={styles.summaryLabel}>日用品数</span>
        </div>
      </div>

      {alertCount === 0 && (
        <div className={`${styles.okBanner} fade-in`}>
          <span className={styles.okIcon}>✨</span>
          <p className={styles.okTitle}>すべて問題なし！</p>
          <p className={styles.okSub}>期限切れ間近の食材や不足品はありません</p>
        </div>
      )}

      {expiring_foods.length > 0 && (
        <section className={`${styles.section} fade-in`}>
          <h2 className={styles.sectionTitle}>
            <span>🔴</span> 期限が近い食材
          </h2>
          <div className={styles.alertList}>
            {expiring_foods.map((item) => (
              <div key={item.id} className={styles.alertItem}>
                <span className={styles.alertName}>{item.name}</span>
                <span className={styles.alertDetail}>×{item.quantity}　期限: {item.expiry_date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {low_supplies.length > 0 && (
        <section className={`${styles.section} fade-in`}>
          <h2 className={styles.sectionTitle}>
            <span>🟡</span> 残量が少ない日用品
          </h2>
          <div className={styles.alertList}>
            {low_supplies.map((item) => (
              <div key={item.id} className={styles.alertItem}>
                <span className={styles.alertName}>{item.name}</span>
                <span className={styles.alertDetailAmber}>少ない</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
