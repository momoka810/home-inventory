import styles from './FoodCard.module.css';

const foodEmojis = {
  default: '🥗',
  肉: '🥩', 魚: '🐟', 野菜: '🥬', 果物: '🍎',
  卵: '🥚', 牛乳: '🥛', パン: '🍞', 米: '🍚',
  豆腐: '🧈', 納豆: '🫘', チーズ: '🧀', ヨーグルト: '🥛',
  鶏: '🍗', 豚: '🥓', 牛: '🥩',
};

function getEmoji(name) {
  for (const [key, emoji] of Object.entries(foodEmojis)) {
    if (key !== 'default' && name.includes(key)) return emoji;
  }
  return foodEmojis.default;
}

function getDaysLeft(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function getBarColor(days) {
  if (days <= 2) return 'terracotta';
  if (days <= 6) return 'amber';
  return 'sage';
}

export default function FoodCard({ item, onEdit, onDelete }) {
  const days = getDaysLeft(item.expiry_date);
  const color = getBarColor(days);
  const barWidth = Math.max(5, Math.min(100, (days / 14) * 100));

  return (
    <div className={`${styles.card} fade-in`}>
      <div className={styles.iconBox}>
        <span className={styles.emoji}>{getEmoji(item.name)}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.quantity}>×{item.quantity}</span>
        </div>
        <div className={styles.barRow}>
          <div className={styles.barTrack}>
            <div
              className={`${styles.barFill} ${styles[color]}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <span className={`${styles.badge} ${styles[color]}`}>
            {days <= 0 ? '期限切れ' : `あと${days}日`}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(item)}>✏️</button>
        <button className={styles.deleteBtn} onClick={() => onDelete(item.id)}>🗑</button>
      </div>
    </div>
  );
}
