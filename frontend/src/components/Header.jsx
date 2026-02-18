import styles from './Header.module.css';

export default function Header() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🧺</span>
        <span className={styles.logoText}>おうち在庫</span>
      </div>
      <span className={styles.date}>{dateStr}</span>
    </header>
  );
}
