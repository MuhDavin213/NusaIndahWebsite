import { ShoppingCart, Store, Phone, Info, Menu, X } from 'lucide-react';
import { QRCodeModal } from '../features/QRCodeModal';
import { useState } from 'react';
import type { Page } from '../../types';

type HeaderProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  cartItemCount: number;
};

export function Header({ currentPage, onPageChange, cartItemCount }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePageChange = (page: Page) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-emerald-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Toko Nusa Indah - Belanja Mudah, Harga Terjangkau</span>
          </div>
          <div className="hidden sm:block">
            <QRCodeModal />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePageChange('beranda')}
          >
            <div className="bg-emerald-600 p-1.5 sm:p-2 rounded-lg">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-emerald-600 text-lg sm:text-2xl">Toko Nusa Indah</h1>
              <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Belanja Hemat Setiap Hari</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => onPageChange('beranda')}
              className={`hover:text-emerald-600 transition-colors ${
                currentPage === 'beranda' ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => onPageChange('tentang')}
              className={`flex items-center gap-2 hover:text-emerald-600 transition-colors ${
                currentPage === 'tentang' ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              <Info className="w-4 h-4" />
              Tentang Kami
            </button>
            <button
              onClick={() => onPageChange('kontak')}
              className={`flex items-center gap-2 hover:text-emerald-600 transition-colors ${
                currentPage === 'kontak' ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4" />
              Kontak
            </button>
            <button
              onClick={() => onPageChange('kelola')}
              className={`hover:text-emerald-600 transition-colors ${
                currentPage === 'kelola' ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              Kelola
            </button>
            <button
              onClick={() => onPageChange('cart')}
              className="relative flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Keranjang
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Cart & Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onPageChange('cart')}
              className="relative p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <button
              onClick={() => handlePageChange('beranda')}
              className={`text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'beranda' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handlePageChange('tentang')}
              className={`text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                currentPage === 'tentang' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Info className="w-4 h-4" />
              Tentang Kami
            </button>
            <button
              onClick={() => handlePageChange('kontak')}
              className={`text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                currentPage === 'kontak' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Phone className="w-4 h-4" />
              Kontak
            </button>
            <button
              onClick={() => handlePageChange('kelola')}
              className={`text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'kelola' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Kelola
            </button>
            <div className="pt-2 border-t border-gray-200 sm:hidden">
              <QRCodeModal />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}