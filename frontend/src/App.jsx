import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './components/pages/HomePage';
import InventoryPage from './components/pages/InventoryPage';
import ShoppingPage from './components/pages/ShoppingPage';
import RecipePage from './components/pages/RecipePage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: '16px 16px 80px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/recipe" element={<RecipePage />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
