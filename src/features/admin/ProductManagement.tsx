import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { imageOptions } from '../../data/imageGallery';
import { getImageUrl } from '../../utils/imageHelper';
import { formatRupiah } from '../../utils/constants';
import type { Barang } from '../../types';

type FormData = Omit<Barang, 'id_barang'>;

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Barang | null>(null);
  const [selectedImageKey, setSelectedImageKey] = useState('noodles');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [formData, setFormData] = useState<FormData>({
    id_user: 1,
    nama_barang: '',
    deskripsi: '',
    harga: 0,
    stok: 0,
    gambar: 'noodles',
    kategori: 'Makanan & Minuman'
  });
  const allImageOptions = imageOptions;

  const openForm = (product?: Barang) => {
    if (product) {
      const isUrl = product.gambar.startsWith('http://') ||
        product.gambar.startsWith('https://') ||
        product.gambar.startsWith('data:');

      setEditingProduct(product);
      setFormData(product);
      setSelectedImageKey(product.gambar);
      setCustomImageUrl(isUrl ? product.gambar : '');
    } else {
      setEditingProduct(null);
      setSelectedImageKey('noodles');
      setCustomImageUrl('');
      setFormData({
        id_user: 1,
        nama_barang: '',
        deskripsi: '',
        harga: '' as any, // Empty string untuk input kosong
        stok: '' as any, // Empty string untuk input kosong
        gambar: 'noodles',
        kategori: categories[0] || 'Makanan & Minuman' // Use first category from list
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct({ ...formData, id_barang: editingProduct.id_barang });
    } else {
      addProduct(formData);
    }
    
    closeForm();
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
    }
  };

  const handleImageSelect = (key: string) => {
    setSelectedImageKey(key);
    setFormData({ ...formData, gambar: key });
    setCustomImageUrl('');
  };

  const handleImageUrlChange = (value: string) => {
    setCustomImageUrl(value);
    const trimmed = value.trim();
    if (trimmed) {
      setSelectedImageKey(trimmed);
      setFormData({ ...formData, gambar: trimmed });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Kelola Produk</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tambah, edit, atau hapus produk di toko Anda
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Produk</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Kategori</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Harga</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Stok</th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id_barang} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(product.gambar)}
                      alt={product.nama_barang}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-gray-900 text-sm sm:text-base truncate">{product.nama_barang}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">{product.deskripsi}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full whitespace-nowrap">
                    {product.kategori}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-gray-900 text-sm sm:text-base whitespace-nowrap">
                  {formatRupiah(product.harga)}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className={`text-sm ${product.stok > 10 ? 'text-gray-900' : 'text-red-600'}`}>
                    {product.stok} unit
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openForm(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id_barang)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">
                  {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <button
                  onClick={closeForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={formData.nama_barang}
                  onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Harga</label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Stok</label>
                <input
                  type="number"
                  value={formData.stok}
                  onChange={(e) => setFormData({ ...formData, stok: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  required
                />
              </div>

              {/* Image URL Section */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Gambar Produk (URL)</label>
                <div className="mb-3">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://contoh.com/gambar.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Masukkan link gambar. Jika diisi, gambar dari URL akan dipakai.
                  </p>
                </div>

                <div className="relative mb-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Atau pilih dari galeri preset</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                  {allImageOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleImageSelect(option.key)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageKey === option.key
                          ? 'border-emerald-500 ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={option.url}
                        alt={option.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                        <p className="text-xs text-white truncate">{option.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
