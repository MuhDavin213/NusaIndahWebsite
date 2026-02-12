// ============================================
// HALAMAN CHECKOUT - RINGKASAN & PRINT
// ============================================

import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Check, AlertCircle } from 'lucide-react';
import { Kuitansi } from './Kuitansi';
import { hitungTotalDenganPromo } from './hitungPromo';
import { simpanPesananDanUpdateStok } from '../../database/pesananService';
import { formatRupiah } from '../../utils/constants';
import type { Keranjang } from '../../types';
import type { PromoConfig, Order, OrderItem } from '../../database/koleksi';

interface Props {
  keranjang: Keranjang;
  promo: PromoConfig | null;
  onKembali: () => void;
  onSelesai: () => void;
}

export function HalamanCheckout({
  keranjang,
  promo,
  onKembali,
  onSelesai,
}: Props) {
  const [status, setStatus] = useState<
    'idle' | 'printing' | 'saving' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  // Hitung total dengan promo auto-apply
  const subtotal = keranjang.items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );
  const rincian = hitungTotalDenganPromo(subtotal, promo);

  // Generate nomor order
  useEffect(() => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    setOrderId(`INV-${timestamp}-${random}`);
  }, []);

  // Prepare order data
  const orderItems: OrderItem[] = keranjang.items.map((item) => ({
    productId: item.id_barang,
    nama: item.nama_barang,
    harga: item.harga,
    qty: item.jumlah,
    subtotal: item.subtotal,
  }));

  const orderData: Omit<Order, 'id' | 'dibuatPada'> = {
    items: orderItems,
    subtotal: rincian.subtotal,
    promo: rincian.promo,
    total: rincian.total,
  };

  // Handle Print & Save
  const handlePrintDanSimpan = async () => {
    try {
      // 1. Print kuitansi
      setStatus('printing');
      window.print();

      // 2. Simpan ke Firebase & update stok (ATOMIC)
      setStatus('saving');
      const result = await simpanPesananDanUpdateStok(orderData);

      if (!result.success) {
        throw new Error(result.error);
      }

      // 3. Sukses
      setStatus('success');
      setOrderId(result.orderId || orderId);

      // 4. Clear cart & redirect setelah 2 detik
      setTimeout(() => {
        onSelesai();
      }, 2000);
    } catch (error: any) {
      console.error('Error print & simpan:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Terjadi kesalahan');
    }
  };

  // Handle retry save (jika print sudah jalan tapi save gagal)
  const handleCobaSimpanLagi = async () => {
    try {
      setStatus('saving');
      setErrorMessage('');

      const result = await simpanPesananDanUpdateStok(orderData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setStatus('success');
      setOrderId(result.orderId || orderId);

      setTimeout(() => {
        onSelesai();
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={onKembali}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors no-print"
            disabled={status === 'saving' || status === 'success'}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Ringkasan Checkout
          </h1>
        </div>

        {/* Ringkasan Belanja */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold mb-4">Detail Belanja</h2>

          {/* Items */}
          <div className="space-y-3 mb-6 border-b pb-6">
            {keranjang.items.map((item) => (
              <div
                key={item.id_detail}
                className="flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.nama_barang}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatRupiah(item.harga)} × {item.jumlah}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatRupiah(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">
                {formatRupiah(rincian.subtotal)}
              </span>
            </div>

            {rincian.promo && rincian.promo.aktif && (
              <div className="flex justify-between text-lg text-emerald-600">
                <div>
                  <span className="font-semibold">Promo diterapkan:</span>
                  <p className="text-sm text-gray-600">{rincian.promo.teks}</p>
                  <p className="text-sm">Diskon {rincian.promo.persen}%</p>
                </div>
                <span className="font-semibold">
                  - {formatRupiah(rincian.promo.discountNominal)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold border-t-2 pt-4">
              <span>Total:</span>
              <span className="text-emerald-600">
                {formatRupiah(rincian.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Print */}
        {status === 'idle' && (
          <button
            onClick={handlePrintDanSimpan}
            className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 text-lg font-semibold no-print"
          >
            <Printer className="w-6 h-6" />
            Print Kuitansi & Simpan Transaksi
          </button>
        )}

        {/* Loading Save */}
        {(status === 'printing' || status === 'saving') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 no-print">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 font-medium">
                {status === 'printing'
                  ? 'Mencetak kuitansi...'
                  : 'Menyimpan transaksi & update stok...'}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 no-print">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-green-800 font-semibold mb-1">
                  Transaksi Berhasil!
                </p>
                <p className="text-green-700 text-sm">
                  Order ID: {orderId}
                </p>
                <p className="text-green-700 text-sm">
                  Stok produk telah diperbarui. Mengalihkan...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="space-y-4 no-print">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-800 font-semibold mb-1">
                    Gagal Menyimpan Transaksi
                  </p>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCobaSimpanLagi}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Simpan Lagi
            </button>

            <button
              onClick={onKembali}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Kembali ke Keranjang
            </button>
          </div>
        )}

        {/* Kuitansi (hidden, untuk print) */}
        <div className="hidden print:block">
          <Kuitansi
            order={orderData}
            nomorOrder={orderId}
            tanggal={new Date()}
          />
        </div>
      </div>
    </div>
  );
}
