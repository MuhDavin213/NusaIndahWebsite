import { Store, Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-6 h-6 text-emerald-500" />
              <span className="text-xl text-white">Toko Nusa Indah</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Toko serba ada terpercaya yang menyediakan berbagai kebutuhan sehari-hari dengan harga terjangkau dan kualitas terbaik.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Jl. Nusa Indah No. 123, Jakarta Selatan, DKI Jakarta 12345</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm">+62 21 1234 5678</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm">info@tokonusaindah.com</p>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-white mb-4">Jam Operasional</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">Senin - Sabtu</p>
                  <p className="text-gray-400">08:00 - 20:00 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">Minggu</p>
                  <p className="text-gray-400">09:00 - 18:00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h3 className="text-white mb-4">Ikuti Kami</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">Metode Pembayaran:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-800 rounded text-xs">Cash</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-xs">Transfer</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-xs">E-Wallet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Toko Nusa Indah. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
