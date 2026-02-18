import styles from './RecipeCard.module.css';

export default function RecipeCard({ recipe }) {
  const lines = recipe.split('\n');
  const title = lines[0]?.replace(/^【.*?】/, '').trim() || 'おすすめレシピ';

  return (
    <div className={`${styles.card} fade-in`}>
      <div className={styles.gradientLine} />
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.content}>
          {recipe}
        </div>
      </div>
    </div>
  );
}
