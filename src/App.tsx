import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';

import CustomerLayout from '@/components/menu/CustomerLayout';
import MenuPage from '@/pages/customer/MenuPage';
import HomePage from '@/pages/customer/HomePage';
import ProductPage from '@/pages/customer/ProductPage';
import CartPage from '@/pages/customer/CartPage';
import OrderConfirmationPage from '@/pages/customer/OrderConfirmationPage';
import GameCenterPage from '@/pages/customer/GameCenterPage';
import FavoritesPage from '@/pages/customer/FavoritesPage';
import SnakeGame from '@/pages/customer/games/SnakeGame';
import MemoryGame from '@/pages/customer/games/MemoryGame';
import CatchFoodGame from '@/pages/customer/games/CatchFoodGame';
import ReactionGame from '@/pages/customer/games/ReactionGame';
import QuizGame from '@/pages/customer/games/QuizGame';
import TruthOrDareGame from '@/pages/customer/games/TruthOrDareGame';
import BlockBlastGame from '@/pages/customer/games/BlockBlastGame';
import RoadRaceGame from '@/pages/customer/games/RoadRaceGame';
import XOGame from '@/pages/customer/games/XOGame';
import WaterSortGame from '@/pages/customer/games/water-sort/WaterSortGame';

import AdminLayout from '@/components/admin/AdminLayout';
import RequireAuth from '@/components/admin/RequireAuth';
import LoginPage from '@/pages/admin/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import OrdersPage from '@/pages/admin/OrdersPage';
import ProductsPage from '@/pages/admin/ProductsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import AddonsPage from '@/pages/admin/AddonsPage';
import PromotionsPage from '@/pages/admin/PromotionsPage';
import GamesPage from '@/pages/admin/GamesPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import ReviewsPage from '@/pages/admin/ReviewsPage';
import SettingsPage from '@/pages/admin/SettingsPage';

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route element={<CustomerLayout />}>
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order/:id" element={<OrderConfirmationPage />} />
                <Route path="/games" element={<GameCenterPage />} />
                <Route path="/games/xo" element={<XOGame />} />
                <Route path="/games/water-sort" element={<WaterSortGame />} />
                <Route path="/games/snake" element={<SnakeGame />} />
                <Route path="/games/memory" element={<MemoryGame />} />
                <Route path="/games/catch-food" element={<CatchFoodGame />} />
                <Route path="/games/reaction" element={<ReactionGame />} />
                <Route path="/games/quiz" element={<QuizGame />} />
                <Route path="/games/truth-or-dare" element={<TruthOrDareGame />} />
                <Route path="/games/block-blast" element={<BlockBlastGame />} />
                <Route path="/games/road-race" element={<RoadRaceGame />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>

              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu" element={<Navigate to="/admin/products" replace />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="addons" element={<AddonsPage />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/menu" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
