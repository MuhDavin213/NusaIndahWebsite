import { useState } from 'react';
import { PasswordProtection } from '../features/admin/PasswordProtection';
import { ProductManagement } from '../features/admin/ProductManagement';
import { PromoManagement } from '../features/admin/PromoManagement';
import { CategoryManagement } from '../features/admin/CategoryManagement';
import { Package, Megaphone, Tag } from 'lucide-react';

type Tab = 'products' | 'promos' | 'categories';

export function KelolaPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('products');

  if (!isUnlocked) {
    return <PasswordProtection onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-gray-900 mb-2">Halaman Kelola</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Kelola produk, kategori, dan banner promo Toko Nusa Indah
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'products'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Kelola Produk</span>
              <span className="sm:hidden">Produk</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'categories'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Kelola Kategori</span>
              <span className="sm:hidden">Kategori</span>
            </button>
            <button
              onClick={() => setActiveTab('promos')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'promos'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Kelola Promo</span>
              <span className="sm:hidden">Promo</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'promos' && <PromoManagement />}
      </div>
    </div>
  );
}