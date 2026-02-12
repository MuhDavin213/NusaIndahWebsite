export interface ItemKeranjang {
  id: string;
  productId: string;
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
  imageUrl: string;
  stokTersedia: number;
}

export interface Keranjang {
  items: ItemKeranjang[];
  totalItems: number;
  totalHarga: number;
}
