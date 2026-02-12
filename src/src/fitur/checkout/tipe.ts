import type { Promo } from '../produk/tipe';
import type { ItemKeranjang } from '../keranjang/tipe';

export interface RincianCheckout {
  items: ItemKeranjang[];
  subtotal: number;
  diskon: number;
  total: number;
  promo: Promo | null;
}

export interface StatusCheckout {
  orderId: string | null;
  status: 'idle' | 'creating-draft' | 'draft-created' | 'processing-payment' | 'paid' | 'error';
  error: string | null;
}
