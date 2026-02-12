import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import type { PromoBannerData } from '../../types';
import { deletePromoBanner, savePromoBanner, subscribePromoBanners } from '../../database/promoBanner';

const PRESET_COLORS = [
  { name: 'Emerald', bg: '#10b981', text: '#ffffff' },
  { name: 'Blue', bg: '#3b82f6', text: '#ffffff' },
  { name: 'Purple', bg: '#8b5cf6', text: '#ffffff' },
  { name: 'Orange', bg: '#f59e0b', text: '#ffffff' },
  { name: 'Red', bg: '#ef4444', text: '#ffffff' },
  { name: 'Pink', bg: '#ec4899', text: '#ffffff' },
  { name: 'Indigo', bg: '#6366f1', text: '#ffffff' },
  { name: 'Yellow', bg: '#eab308', text: '#1f2937' },
  { name: 'Gray', bg: '#6b7280', text: '#ffffff' }
];

export function PromoManagement() {
  const [promos, setPromos] = useState<PromoBannerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoBannerData | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = subscribePromoBanners((items) => {
      setPromos(items);
      setIsLoading(false);
    });

    if (!unsubscribe) {
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const openForm = (promo?: PromoBannerData) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        text: promo.text,
        backgroundColor: promo.backgroundColor,
        textColor: promo.textColor,
        isActive: promo.isActive
      });
    } else {
      setEditingPromo(null);
      setFormData({
        text: '',
        backgroundColor: '#10b981',
        textColor: '#ffffff',
        isActive: true
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPromo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPromo) {
      void savePromoBanner(formData, editingPromo.id);
    } else {
      void savePromoBanner(formData);
    }

    closeForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
      void deletePromoBanner(id);
    }
  };

  const toggleActive = (id: string) => {
    const target = promos.find((promo) => promo.id === id);
    if (!target) return;
    void savePromoBanner(
      {
        text: target.text,
        backgroundColor: target.backgroundColor,
        textColor: target.textColor,
        isActive: !target.isActive
      },
      target.id
    );
  };

  const applyPresetColor = (bg: string, text: string) => {
    setFormData({ ...formData, backgroundColor: bg, textColor: text });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Kelola Banner Promo</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tambah, edit, atau hapus banner promo di halaman utama
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Promo
          </button>
        </div>
      </div>

      {/* Promos List */}
      <div className="p-6 space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Memuat promo dari Firebase...
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Belum ada banner promo di Firebase. Klik "Tambah Promo" untuk membuat yang pertama.
          </div>
        ) : (
          promos.map((promo) => (
            <div
              key={promo.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-4"
                style={{
                  backgroundColor: promo.backgroundColor,
                  color: promo.textColor
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm">{promo.text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(promo.id)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title={promo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {promo.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openForm(promo)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Status: {promo.isActive ? (
                    <span className="text-emerald-600">Aktif</span>
                  ) : (
                    <span className="text-gray-500">Nonaktif</span>
                  )}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>BG: {promo.backgroundColor}</span>
                  <span>•</span>
                  <span>Text: {promo.textColor}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">
                  {editingPromo ? 'Edit Banner Promo' : 'Tambah Banner Promo Baru'}
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
                <label className="block text-sm text-gray-700 mb-2">Teks Promo</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={2}
                  placeholder="Contoh: 🎉 Diskon 20% untuk semua produk!"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Pilih Warna Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => applyPresetColor(color.bg, color.text)}
                      className="p-3 rounded-lg border-2 transition-all hover:scale-105"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        borderColor: formData.backgroundColor === color.bg ? '#1f2937' : 'transparent'
                      }}
                    >
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Warna Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="#10b981"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Warna Teks</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Aktifkan banner ini
                </label>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Preview</label>
                <div
                  className="p-4 rounded-lg text-center"
                  style={{
                    backgroundColor: formData.backgroundColor,
                    color: formData.textColor
                  }}
                >
                  <p className="text-sm">{formData.text || 'Preview teks promo Anda...'}</p>
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
                  {editingPromo ? 'Simpan Perubahan' : 'Tambah Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
