import { Routes, Route } from 'react-router-dom';
import { DropPage } from './pages/DropPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { SoldOutPage } from './pages/SoldOutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AddProductPage } from './pages/AddProductPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DropPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/checkout/:reservationId" element={<CheckoutPage />} />
      <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
      <Route path="/sold-out" element={<SoldOutPage />} />
      <Route path="/add-product" element={<AddProductPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
