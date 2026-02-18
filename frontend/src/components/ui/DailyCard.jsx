import styles from './DailyCard.module.css';

const supplyEmojis = {
  default: '📦',
  トイレットペーパー: '🧻', ティッシュ: '🤧', 洗剤: '🧴',
  シャンプー: '🧴', 石鹸: '🧼', 歯磨き: '🪥', 歯ブラシ: '🪥',
  ゴミ袋: '🗑', ラップ: '📦', スポンジ: '🧽', 柔軟剤: '🌸',
  ハンドソープ: '🧴', 電池: '🔋',
};

function getEmoji(name) {
  for (const [key, emoji] of Object.entries(supplyEmojis)) {
    if (key !== 'default' && name.includes(key)) return emoji;
  }
  return supplyEmojis.default;
}

const levelConfig = {
  '少ない': { dots: 1, color: 'terracotta', label: '少ない' },
  '普通':   { dots: 3, color: 'amber', label: '普通' },
  '多い':   { dots: 5, color: 'sage', label: '十分' },
};

export default function DailyCard({ item, onEdit, onDelete }) {
  const config = levelConfig[item.stock_level] || levelConfig['普通'];

  return (
    <div className={`${styles.card} fade-in`}>
      <div className={styles.iconBox}>
        <span className={styles.emoji}>{getEmoji(item.name)}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.name}>{item.name}</span>
        <div className={styles.dotsRow}>
          <div className={styles.dots}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`${styles.dot} ${n <= config.dots ? styles[config.color] : styles.empty}`}
              />
            ))}
          </div>
          <span className={`${styles.levelText} ${styles[config.color]}`}>
            {config.label}
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
