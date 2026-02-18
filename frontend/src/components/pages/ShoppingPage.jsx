import { useEffect, useState } from 'react';
import { api } from '../../api';
import ShoppingItem from '../ui/ShoppingItem';
import styles from './ShoppingPage.module.css';

export default function ShoppingPage() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getShopping()
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (index) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const clearAll = () => setChecked({});

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  const uncheckedItems = items.filter((_, i) => !checked[i]);
  const checkedItems = items.filter((_, i) => checked[i]);
  const checkedCount = checkedItems.length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>買い物リスト</h2>
          <p className={styles.sub}>
            {items.length === 0 ? '買い物なし' : `残り ${items.length - checkedCount}件`}
          </p>
        </div>
        {checkedCount > 0 && (
          <button className={styles.clearBtn} onClick={clearAll}>
            チェックを外す
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🎉</span>
          <p className={styles.emptyTitle}>買い物リストは空です</p>
          <p className={styles.emptySub}>不足品や期限切れ間近の食材はありません</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {uncheckedItems.map((item) => {
              const origIndex = items.indexOf(item);
              return (
                <ShoppingItem
                  key={origIndex}
                  item={item}
                  checked={false}
                  onToggle={() => toggle(origIndex)}
                />
              );
            })}
          </div>

          {checkedCount > 0 && (
            <>
              <div className={styles.divider}>
                <span>購入済み ({checkedCount})</span>
              </div>
              <div className={styles.list}>
                {checkedItems.map((item) => {
                  const origIndex = items.indexOf(item);
                  return (
                    <ShoppingItem
                      key={origIndex}
                      item={item}
                      checked={true}
                      onToggle={() => toggle(origIndex)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
