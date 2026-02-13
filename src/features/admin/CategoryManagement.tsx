import { useState } from 'react';
import { Plus, Trash2, Tag, X } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { toast } from 'sonner';

export function CategoryManagement() {
  const {
    categories,
    isLoading,
    error,
    clearError,
    addCategory,
    removeCategory,
    isDefaultCategory
  } = useCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addCategory(newCategory);
    if (success) {
      toast.success('Kategori berhasil ditambahkan!');
      setNewCategory('');
      setIsAdding(false);
    } else {
      toast.error('Kategori gagal ditambahkan. Cek data atau koneksi Firebase.');
    }
  };

  const handleRemoveCategory = async (category: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${category}"?`)) {
      const success = await removeCategory(category);
      if (success) {
        toast.success('Kategori berhasil dihapus!');
      } else {
        toast.error('Kategori gagal dihapus atau termasuk kategori default.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Kelola Kategori</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tambah atau hapus kategori produk
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {isAdding ? (
              <>
                <X className="w-4 h-4" />
                Batal
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Tambah Kategori
              </>
            )}
          </button>
        </div>
        {isLoading && (
          <p className="mt-2 text-xs text-gray-500">Memuat kategori dari Firebase...</p>
        )}
        {!isLoading && error && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <span>Gagal load kategori: {error}</span>
            <button
              onClick={clearError}
              className="text-red-700 underline underline-offset-2"
              type="button"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="p-6 bg-emerald-50 border-b border-gray-200">
          <form onSubmit={handleAddCategory} className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nama kategori baru..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Simpan
            </button>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Tag className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-900">{category}</p>
                  {isDefaultCategory(category) && (
                    <p className="text-xs text-gray-500">Kategori Default</p>
                  )}
                </div>
              </div>
              {!isDefaultCategory(category) && (
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada kategori</p>
          </div>
        )}
      </div>
    </div>
  );
}
