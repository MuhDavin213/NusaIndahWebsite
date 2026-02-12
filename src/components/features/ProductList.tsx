import { ProductCard } from './ProductCard';
import { CategoryNav } from '../layout/CategoryNav';
import { Search, Package, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { normalizeCategory } from '../../utils/categoryHelper';
import type { Barang } from '../../types';

type ProductListProps = {
  products: Barang[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Barang, quantity: number) => void;
};

export function ProductList({ 
  products, 
  selectedCategory, 
  onCategoryChange, 
  onAddToCart 
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'stock'>('name');
  
  const normalizedSelected = normalizeCategory(selectedCategory);
  const categoryFiltered = selectedCategory === 'Semua' 
    ? products 
    : products.filter(p => normalizeCategory(p.kategori) === normalizedSelected);
  
  const searchFiltered = categoryFiltered.filter(product => 
    product.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = [...searchFiltered].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.nama_barang.localeCompare(b.nama_barang);
      case 'price-low':
        return a.harga - b.harga;
      case 'price-high':
        return b.harga - a.harga;
      case 'stock':
        return b.stok - a.stok;
      default:
        return 0;
    }
  });

  return (
    <div>
      <CategoryNav 
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      {/* Search and Sort Bar */}
      <div className="mb-4 sm:mb-6 mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-sm sm:text-base"
          >
            <option value="name">Nama A-Z</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="stock">Stok Terbanyak</option>
          </select>
        </div>
      </div>

      {searchQuery && (
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
          Ditemukan {filteredProducts.length} produk
        </p>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-900 mb-1">Produk tidak ditemukan</p>
          <p className="text-xs sm:text-sm text-gray-500 px-4">
            {searchQuery 
              ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
              : 'Tidak ada produk dalam kategori ini'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id_barang}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
