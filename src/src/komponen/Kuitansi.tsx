import { formatRupiah } from '../utils/formatRupiah';
import { APP_NAME } from '../utils/konstanta';
import type { RincianCheckout } from '../fitur/checkout/tipe';

interface Props {
  rincian: RincianCheckout;
  nomorOrder: string;
  tanggal: Date;
}

export function Kuitansi({ rincian, nomorOrder, tanggal }: Props) {
  const formatTanggal = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      <div className="border-4 border-emerald-600 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">{APP_NAME}</h1>
          <p className="text-sm text-gray-600">Jl. Raya Merdeka No. 123, Jakarta Selatan</p>
          <p className="text-sm text-gray-600">Telp: (021) 1234-5678</p>
        </div>

        <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">KUITANSI PEMBAYARAN</h2>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nomor Order:</p>
            <p className="font-bold text-lg">{nomorOrder}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Tanggal:</p>
            <p className="font-bold">{formatTanggal(tanggal)}</p>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2">No</th>
              <th className="text-left py-3 px-2">Nama Produk</th>
              <th className="text-center py-3 px-2">Qty</th>
              <th className="text-right py-3 px-2">Harga</th>
              <th className="text-right py-3 px-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rincian.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2">{index + 1}</td>
                <td className="py-3 px-2">{item.nama}</td>
                <td className="py-3 px-2 text-center">{item.qty}</td>
                <td className="py-3 px-2 text-right">{formatRupiah(item.harga)}</td>
                <td className="py-3 px-2 text-right font-semibold">{formatRupiah(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Subtotal:</span>
            <span>{formatRupiah(rincian.subtotal)}</span>
          </div>
          
          {rincian.diskon > 0 && rincian.promo && (
            <div className="flex justify-between text-lg text-emerald-600">
              <span className="font-semibold">
                Diskon ({rincian.promo.text}):
              </span>
              <span>- {formatRupiah(rincian.diskon)}</span>
            </div>
          )}

          <div className="flex justify-between text-2xl font-bold border-t-2 border-gray-300 pt-4">
            <span>TOTAL:</span>
            <span className="text-emerald-600">{formatRupiah(rincian.total)}</span>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mt-8 pt-6 border-t border-gray-300">
          <p className="font-semibold mb-2">Terima kasih atas pembelian Anda!</p>
          <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-12">Pembeli</p>
            <div className="border-t border-gray-400 w-40 mx-auto"></div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-12">Kasir</p>
            <div className="border-t border-gray-400 w-40 mx-auto"></div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
