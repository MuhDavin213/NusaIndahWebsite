import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getImageUrl } from '../../utils/imageHelper';
import { formatRupiah } from '../../utils/constants';
import type { Barang } from '../../types';

type ProductCardProps = {
  product: Barang;
  onAddToCart: (product: Barang, quantity: number) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const imageUrl = getImageUrl(product.gambar);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <ImageWithFallback
          src={imageUrl}
          alt={product.nama_barang}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.stok <= 5 && product.stok > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Stok Terbatas
          </div>
        )}
        {product.stok === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Habis
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            {product.kategori}
          </span>
        </div>
        
        <h3 className="text-gray-900 mb-2 text-sm sm:text-base">{product.nama_barang}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{product.deskripsi}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-emerald-600 text-sm sm:text-base">{formatRupiah(product.harga)}</span>
          <span className={`text-xs sm:text-sm ${product.stok <= 5 ? 'text-orange-600' : 'text-gray-500'}`}>
            Stok: {product.stok}
          </span>
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Quantity Selector - Full width, prominent */}
          <div className="flex items-center justify-center gap-3 border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
              aria-label="Kurangi jumlah"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="px-4 py-1 min-w-[4rem] text-center text-lg font-semibold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stok, quantity + 1))}
              disabled={quantity >= product.stok}
              className={`p-2 bg-white border border-gray-300 rounded-lg transition-all active:scale-95 ${
                quantity >= product.stok
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600'
              }`}
              aria-label="Tambah jumlah"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stok === 0 || justAdded}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all text-sm sm:text-base font-medium ${
              justAdded
                ? 'bg-green-600 text-white'
                : product.stok === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" />
                Ditambahkan
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                {product.stok === 0 ? 'Habis' : 'Tambah ke Keranjang'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}