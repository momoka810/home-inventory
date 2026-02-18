import styles from './ShoppingItem.module.css';

export default function ShoppingItem({ item, checked, onToggle }) {
  return (
    <div
      className={`${styles.item} ${checked ? styles.checked : ''} fade-in`}
      onClick={onToggle}
    >
      <div className={`${styles.circle} ${checked ? styles.circleChecked : ''}`}>
        {checked && <span className={styles.checkmark}>✓</span>}
      </div>
      <span className={`${styles.name} ${checked ? styles.nameChecked : ''}`}>
        {item.name}
      </span>
      <span className={`${styles.tag} ${item.type === 'food' ? styles.tagFood : styles.tagSupply}`}>
        {item.type === 'food' ? '食材' : '日用品'}
      </span>
    </div>
  );
}
