import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, ClipboardCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getImageUrl } from '../utils/imageHelper';
import { formatRupiah } from '../utils/constants';
import type { Keranjang, Barang } from '../types';
import { getPromoConfig, type PromoConfig } from '../database/promo';
import { CheckoutModal } from '../components/CheckoutModal';

type CartPageProps = {
  cart: Keranjang;
  products: Barang[];
  isProductsLoading?: boolean;
  productsError?: string | null;
  onUpdateItem: (id_detail: number, quantity: number) => void;
  onRemoveItem: (id_detail: number) => void;
  onClearCart?: () => void; // Tambahan untuk clear cart setelah checkout
};

type StockCheckResult = {
  available: boolean;
  items: {
    id_detail: number;
    nama_barang: string;
    requested: number;
    available: number;
    status: 'ok' | 'insufficient' | 'out_of_stock';
  }[];
};

export function CartPage({
  cart,
  products,
  isProductsLoading = false,
  productsError = null,
  onUpdateItem,
  onRemoveItem,
  onClearCart
}: CartPageProps) {
  const [stockCheck, setStockCheck] = useState<StockCheckResult | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  
  // State untuk promo dan checkout
  const [promo, setPromo] = useState<PromoConfig | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  const totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Load promo aktif saat component mount
  useEffect(() => {
    getPromoConfig()
      .then(promoData => {
        setPromo(promoData);
      })
      .catch(error => {
        // Ignore error jika Firebase belum disetup
        console.warn('Promo feature disabled:', error.message);
        setPromo(null);
      });
  }, []);

  // Hitung diskon dari promo
  const diskon = promo ? Math.floor((totalAmount * promo.discountPercent) / 100) : 0;
  const totalSetelahDiskon = totalAmount - diskon;

  const handleCheckStock = () => {
    const results: StockCheckResult = {
      available: true,
      items: []
    };

    cart.items.forEach(item => {
      const product = products.find(p => p.id_barang === item.id_barang);
      if (!product) return;

      let status: 'ok' | 'insufficient' | 'out_of_stock' = 'ok';
      
      if (product.stok === 0) {
        status = 'out_of_stock';
        results.available = false;
      } else if (item.jumlah > product.stok) {
        status = 'insufficient';
        results.available = false;
      }

      results.items.push({
        id_detail: item.id_detail,
        nama_barang: product.nama_barang,
        requested: item.jumlah,
        available: product.stok,
        status
      });
    });

    setStockCheck(results);
    setShowStockModal(true);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h2 className="text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 text-sm sm:text-base px-4">Belum ada produk yang ditambahkan ke keranjang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-gray-900 mb-2">Keranjang Belanja</h2>
          <p className="text-gray-600 text-sm sm:text-base">{cart.items.length} item dalam keranjang</p>
          {isProductsLoading && (
            <p className="text-xs text-gray-500 mt-1">Memuat data produk dari Firebase...</p>
          )}
          {!isProductsLoading && productsError && (
            <p className="text-xs text-red-600 mt-1">Data produk belum sinkron: {productsError}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.items.map((item) => {
              const product = products.find(p => p.id_barang === item.id_barang);
              if (!product) return null;

              const imageUrl = getImageUrl(product.gambar);

              return (
                <div
                  key={item.id_detail}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={imageUrl}
                        alt={product.nama_barang}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 mb-1 text-sm sm:text-base">{product.nama_barang}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                        {product.deskripsi}
                      </p>
                      <p className="text-emerald-600">{formatRupiah(product.harga)}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => onRemoveItem(item.id_detail)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                      </button>

                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateItem(item.id_detail, item.jumlah - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center">{item.jumlah}</span>
                        <button
                          onClick={() => onUpdateItem(item.id_detail, item.jumlah + 1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.jumlah >= product.stok}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-gray-900">{formatRupiah(item.subtotal)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-gray-900 mb-4">Ringkasan Pesanan</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} item)</span>
                  <span>{formatRupiah(totalAmount)}</span>
                </div>
                {promo && (
                  <div className="flex justify-between text-gray-600">
                    <span>Diskon ({promo.discountPercent}%)</span>
                    <span>-{formatRupiah(diskon)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Total</span>
                    <span className="text-emerald-600 text-xl">{formatRupiah(totalSetelahDiskon)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckStock}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <ClipboardCheck className="w-5 h-5" />
                Cek Barang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Check Modal */}
      {showStockModal && stockCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stockCheck.available ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {stockCheck.available ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-lg sm:text-xl">Hasil Pemeriksaan Stok</h3>
                    <p className="text-sm text-gray-600">
                      {stockCheck.available ? 'Semua barang tersedia!' : 'Ada masalah dengan stok barang'}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowStockModal(false)}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {stockCheck.items.map(item => (
                  <div
                    key={item.id_detail}
                    className={`p-4 rounded-lg border-2 transition-all ${item.status === 'ok' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {item.status === 'ok' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium mb-1 ${item.status === 'ok' ? 'text-emerald-900' : 'text-red-900'}`}>
                            {item.nama_barang}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <span className={item.status === 'ok' ? 'text-emerald-700' : 'text-red-700'}>
                              Diminta: <strong>{item.requested}</strong>
                            </span>
                            <span className={item.status === 'ok' ? 'text-emerald-700' : 'text-red-700'}>
                              Tersedia: <strong>{item.available}</strong>
                            </span>
                          </div>
                          {item.status === 'insufficient' && (
                            <p className="text-xs text-red-600 mt-1">
                              Stok tidak mencukupi. Silakan kurangi jumlah pesanan.
                            </p>
                          )}
                          {item.status === 'out_of_stock' && (
                            <p className="text-xs text-red-600 mt-1">
                              Barang habis. Silakan hapus dari keranjang.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              {stockCheck.available ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">Semua barang tersedia dan siap untuk diproses!</p>
                  </div>
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Checkout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">Harap perbaiki masalah stok sebelum melanjutkan</p>
                  </div>
                  <button
                    onClick={() => setShowStockModal(false)}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Kembali ke Keranjang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          products={products}
          totalAmount={totalSetelahDiskon}
          onClearCart={onClearCart}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </div>
  );
}
