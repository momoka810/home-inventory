import { useState } from 'react';
import { api } from '../../api';
import RecipeCard from '../ui/RecipeCard';
import styles from './RecipePage.module.css';

export default function RecipePage() {
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setRecipe('');
    try {
      const data = await api.getRecipe();
      if (data.detail) {
        setError(data.detail);
      } else {
        setRecipe(data.recipe);
      }
    } catch {
      setError('レシピの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.intro} fade-in`}>
        <span className={styles.introIcon}>🍳</span>
        <h2 className={styles.introTitle}>レシピ提案</h2>
        <p className={styles.introText}>
          現在の食材在庫をもとに、AIがレシピを提案します。
          <br />
          賞味期限が近い食材を優先的に使います。
        </p>
      </div>

      {error && (
        <div className={`${styles.error} fade-in`}>
          <span>⚠️</span> {error}
        </div>
      )}

      {recipe && (
        <RecipeCard recipe={recipe} />
      )}

      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner} />
            生成中...
          </span>
        ) : recipe ? (
          'もっと提案してもらう'
        ) : (
          'レシピを提案してもらう'
        )}
      </button>
    </div>
  );
}
