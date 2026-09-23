import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';

import CustomerLayout from '@/components/menu/CustomerLayout';
import MenuPage from '@/pages/customer/MenuPage';
import HomePage from '@/pages/customer/HomePage';
const ProductPage = lazy(() => import('@/pages/customer/ProductPage'));
const CartPage = lazy(() => import('@/pages/customer/CartPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/customer/OrderConfirmationPage'));
const GameCenterPage = lazy(() => import('@/pages/customer/GameCenterPage'));
const FavoritesPage = lazy(() => import('@/pages/customer/FavoritesPage'));
const SnakeGame = lazy(() => import('@/pages/customer/games/SnakeGame'));
const MemoryGame = lazy(() => import('@/pages/customer/games/MemoryGame'));
const CatchFoodGame = lazy(() => import('@/pages/customer/games/CatchFoodGame'));
const ReactionGame = lazy(() => import('@/pages/customer/games/ReactionGame'));
const QuizGame = lazy(() => import('@/pages/customer/games/QuizGame'));
const TruthOrDareGame = lazy(() => import('@/pages/customer/games/TruthOrDareGame'));
const BlockBlastGame = lazy(() => import('@/pages/customer/games/BlockBlastGame'));
const RoadRaceGame = lazy(() => import('@/pages/customer/games/RoadRaceGame'));
const XOGame = lazy(() => import('@/pages/customer/games/XOGame'));
const WaterSortGame = lazy(() => import('@/pages/customer/games/water-sort/WaterSortGame'));

import AdminLayout from '@/components/admin/AdminLayout';
import RequireAuth from '@/components/admin/RequireAuth';
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage'));
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const CategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'));
const AddonsPage = lazy(() => import('@/pages/admin/AddonsPage'));
const PromotionsPage = lazy(() => import('@/pages/admin/PromotionsPage'));
const GamesPage = lazy(() => import('@/pages/admin/GamesPage'));
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'));
const ReviewsPage = lazy(() => import('@/pages/admin/ReviewsPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-cream-50 text-sm text-ink-500">Loading...</div>}>
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
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
