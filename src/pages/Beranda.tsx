import { PromoBanner } from '../components/features/PromoBanner';
import { ProductList } from '../components/features/ProductList';
import type { Barang } from '../types';

type BerandaProps = {
  products: Barang[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Barang, quantity: number) => void;
};

export function Beranda({ 
  products, 
  selectedCategory, 
  onCategoryChange, 
  onAddToCart 
}: BerandaProps) {
  return (
    <>
      <PromoBanner />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <ProductList
          products={products}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onAddToCart={onAddToCart}
        />
      </div>
    </>
  );
}