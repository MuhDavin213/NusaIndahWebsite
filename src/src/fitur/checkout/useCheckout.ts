import { useState, useCallback } from 'react';
import { buatOrderDraft, updateOrderStatus, hapusOrderDraft } from '../../database/koleksi';
import { kurangiStokProduk } from '../../database/transaksi';
import type { StatusCheckout, RincianCheckout } from './tipe';
import type { OrderItem } from '../produk/tipe';
import { buatPromoSnapshot } from './hitungTotal';

export function useCheckout() {
  const [status, setStatus] = useState<StatusCheckout>({
    orderId: null,
    status: 'idle',
    error: null,
  });

  /**
   * STEP 1: BUAT ORDER DRAFT
   * 
   * Dipanggil saat user klik tombol "Checkout" di halaman keranjang
   * - Buat order dengan status "draft"
   * - TIDAK mengurangi stok
   * - Return orderId untuk halaman checkout
   */
  const buatDraft = useCallback(async (rincian: RincianCheckout) => {
    setStatus({ orderId: null, status: 'creating-draft', error: null });

    try {
      const orderItems: OrderItem[] = rincian.items.map((item) => ({
        productId: item.productId,
        nama: item.nama,
        harga: item.harga,
        qty: item.qty,
        subtotal: item.subtotal,
      }));

      const orderId = await buatOrderDraft({
        status: 'draft',
        items: orderItems,
        subtotal: rincian.subtotal,
        discount: rincian.diskon,
        total: rincian.total,
        promoSnapshot: buatPromoSnapshot(rincian.promo),
      });

      setStatus({ orderId, status: 'draft-created', error: null });
      return { success: true, orderId };
    } catch (error: any) {
      setStatus({ orderId: null, status: 'error', error: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * STEP 2: COMMIT PAYMENT (PRINT KUITANSI)
   * 
   * Dipanggil saat user klik tombol "Print Kuitansi"
   * - Jalankan transaksi Firestore untuk kurangi stok
   * - Update order status jadi "paid"
   * - Return success untuk trigger print
   */
  const commitPayment = useCallback(async (orderId: string, rincian: RincianCheckout) => {
    setStatus((prev) => ({ ...prev, status: 'processing-payment', error: null }));

    try {
      const hasil = await kurangiStokProduk(rincian.items);

      if (!hasil.sukses) {
        const errorMsg = hasil.itemGagal
          ? `Stok tidak mencukupi:\n${hasil.itemGagal
              .map((item) => `- ${item.nama}: diminta ${item.diminta}, tersedia ${item.tersedia}`)
              .join('\n')}`
          : hasil.pesan;

        setStatus((prev) => ({ ...prev, status: 'error', error: errorMsg }));
        return { success: false, error: errorMsg };
      }

      await updateOrderStatus(orderId, 'paid');

      setStatus({ orderId, status: 'paid', error: null });
      return { success: true };
    } catch (error: any) {
      setStatus((prev) => ({ ...prev, status: 'error', error: error.message }));
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * BATALKAN ORDER DRAFT
   * 
   * Dipanggil jika user membatalkan checkout sebelum print
   */
  const batalkanDraft = useCallback(async (orderId: string) => {
    try {
      await hapusOrderDraft(orderId);
      setStatus({ orderId: null, status: 'idle', error: null });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const resetStatus = useCallback(() => {
    setStatus({ orderId: null, status: 'idle', error: null });
  }, []);

  return {
    status,
    buatDraft,
    commitPayment,
    batalkanDraft,
    resetStatus,
  };
}
