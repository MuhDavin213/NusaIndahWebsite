import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export function Kontak() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat Toko',
      content: (
        <>
          Jl. Raya Merdeka No. 123<br />
          Kelurahan Sejahtera, Kecamatan Bahagia<br />
          Jakarta Selatan 12345<br />
          DKI Jakarta, Indonesia
        </>
      ),
      color: 'emerald'
    },
    {
      icon: Phone,
      title: 'Telepon',
      content: (
        <div className="space-y-2">
          <div>
            <span className="block text-sm text-gray-500">Telepon Toko:</span>
            <a href="tel:+622112345678" className="text-blue-600 hover:underline">
              (021) 1234-5678
            </a>
          </div>
          <div>
            <span className="block text-sm text-gray-500">WhatsApp:</span>
            <a href="https://wa.me/6281234567890" className="text-blue-600 hover:underline">
              +62 812-3456-7890
            </a>
          </div>
        </div>
      ),
      color: 'blue'
    },
    {
      icon: Mail,
      title: 'Email',
      content: (
        <a href="mailto:info@tokonusaindah.com" className="text-blue-600 hover:underline">
          info@tokonusaindah.com
        </a>
      ),
      color: 'purple'
    }
  ];

  const operatingHours = [
    { day: 'Senin - Jumat', hours: '08:00 - 20:00 WIB' },
    { day: 'Sabtu', hours: '08:00 - 21:00 WIB' },
    { day: 'Minggu & Hari Libur', hours: '09:00 - 18:00 WIB' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">Hubungi Kami</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Kami siap melayani Anda! Hubungi kami melalui berbagai channel atau kunjungi toko kami langsung.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 sm:p-6 border border-gray-200 hover:border-emerald-300"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className={`p-3 bg-${info.color}-50 rounded-xl`}>
                  <info.icon className={`w-6 h-6 text-${info.color}-600`} />
                </div>
                <h3 className="text-gray-900">{info.title}</h3>
              </div>
              <div className="text-gray-600">{info.content}</div>
            </div>
          ))}
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-12 border border-gray-200 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-gray-900">Jam Operasional</h2>
          </div>
          <div className="space-y-4">
            {operatingHours.map((schedule, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{schedule.day}</span>
                <span className="text-emerald-600">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-center text-white max-w-2xl mx-auto">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="mb-4">Butuh Bantuan Cepat?</h2>
          <p className="mb-6 opacity-90">
            Hubungi kami melalui WhatsApp untuk respon lebih cepat
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}