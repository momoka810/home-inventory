import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const navItems = [
  { to: '/', icon: '🏠', label: 'ホーム' },
  { to: '/inventory', icon: '📦', label: '在庫' },
  { to: '/shopping', icon: '🛒', label: '買い物' },
  { to: '/recipe', icon: '🍳', label: 'レシピ' },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
