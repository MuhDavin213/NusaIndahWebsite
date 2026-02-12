import { Store, Heart, Award, TrendingUp } from 'lucide-react';

export function TentangKami() {
  const values = [
    {
      icon: Heart,
      title: 'Pelayanan Terbaik',
      description: 'Kami melayani setiap pelanggan dengan ramah dan profesional, karena kepuasan Anda adalah prioritas kami.'
    },
    {
      icon: Award,
      title: 'Kualitas Terjamin',
      description: 'Setiap produk yang kami jual dipilih dengan teliti untuk memastikan kualitas terbaik bagi pelanggan.'
    },
    {
      icon: TrendingUp,
      title: 'Harga Terjangkau',
      description: 'Kami berkomitmen memberikan harga yang kompetitif tanpa mengurangi kualitas produk.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl">
              <Store className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">Tentang Toko Nusa Indah</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base px-4">
            Toko kelontong terpercaya yang menyediakan berbagai kebutuhan sehari-hari 
            dengan harga terjangkau dan pelayanan terbaik untuk keluarga Indonesia.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 sm:mb-12 border border-gray-200">
          <h2 className="text-gray-900 mb-4 text-center text-xl sm:text-2xl">Cerita Kami</h2>
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
            <p>
              <strong className="text-gray-900">Toko Nusa Indah</strong> berdiri dengan misi sederhana namun mulia: 
              menyediakan kebutuhan sehari-hari berkualitas dengan harga yang terjangkau untuk setiap keluarga Indonesia.
            </p>
            <p>
              Kami memahami bahwa kebutuhan rumah tangga adalah prioritas utama setiap keluarga. 
              Oleh karena itu, kami berkomitmen untuk selalu menyediakan produk-produk pilihan, 
              mulai dari makanan & minuman, peralatan rumah tangga, hingga mainan anak-anak.
            </p>
            <p>
              Dengan pelayanan ramah dan harga bersahabat, <strong className="text-gray-900">Toko Nusa Indah</strong>
              {' '}telah menjadi bagian dari kehidupan sehari-hari masyarakat sekitar, 
              menjadi tempat berbelanja yang nyaman dan terpercaya.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-gray-900 mb-6 sm:mb-8 text-center text-xl sm:text-2xl">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-emerald-50 rounded-full">
                    <value.icon className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-gray-900 mb-2 sm:mb-3 text-center text-base sm:text-lg">{value.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <h2 className="mb-4">Siap Berbelanja?</h2>
          <p className="mb-6 opacity-90">
            Kunjungi toko kami atau hubungi untuk informasi lebih lanjut
          </p>
          <a
            href="#"
            className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  );
}