import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { Beranda } from './pages/Beranda';
import { KelolaPage } from './pages/KelolaPage';
import { CartPage } from './pages/CartPage';
import { TentangKami } from './pages/TentangKami';
import { Kontak } from './pages/Kontak';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import type { Page, Barang } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('beranda');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  const { products, isLoading: isProductsLoading, error: productsError } = useProducts();
  const {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount
  } = useCart(products);

  const handleAddToCart = (product: Barang, quantity: number) => {
    if (quantity > product.stok) {
      toast.error('Stok tidak mencukupi!');
      return;
    }
    
    addToCart(product, quantity);
    toast.success(`${product.nama_barang} ditambahkan ke keranjang!`);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'beranda':
        return (
          <Beranda
            products={products}
            isProductsLoading={isProductsLoading}
            productsError={productsError}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={handleAddToCart}
          />
        );
      
      case 'kelola':
        return <KelolaPage />;
      
      case 'cart':
        return (
          <CartPage
            cart={cart}
            products={products}
            isProductsLoading={isProductsLoading}
            productsError={productsError}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
          />
        );
      
      case 'tentang':
        return <TentangKami />;
      
      case 'kontak':
        return <Kontak />;
      
      default:
        return (
          <Beranda
            products={products}
            isProductsLoading={isProductsLoading}
            productsError={productsError}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        cartItemCount={getCartItemCount()}
      />
      <main>{renderPage()}</main>
      <Footer />
      <Toaster position="top-right" richColors />
      <ScrollToTop />
    </div>
  );
}
