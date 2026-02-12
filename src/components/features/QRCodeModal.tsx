import { useState } from 'react';
import { QrCode, X, Download, Smartphone } from 'lucide-react';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export function QRCodeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentUrl = window.location.href;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const isMobile = window.innerWidth < 640;
      const qrSize = isMobile ? 240 : 300;
      
      QRCode.toCanvas(
        canvasRef.current,
        currentUrl,
        {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#059669',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [isOpen, currentUrl]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'toko-nusa-indah-qr.png';
      link.href = dataUrl;
      link.click();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:opacity-80 transition-opacity"
      >
        <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">QR Code</span>
        <span className="xs:hidden">QR</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-gray-900 text-base sm:text-lg">QR Code Website</h2>
              <p className="text-xs sm:text-sm text-gray-500">Scan untuk akses website</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-4 sm:p-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 sm:border-4 border-emerald-500 p-4 sm:p-6 mx-auto w-fit">
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
          </div>

          {/* URL Display */}
          <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Website URL:</p>
            <p className="text-emerald-700 break-all text-xs sm:text-sm font-mono">{currentUrl}</p>
          </div>

          {/* Instructions */}
          <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-900 mb-2">
              <strong>Cara Scan:</strong>
            </p>
            <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Buka kamera smartphone Anda</li>
              <li>Arahkan ke QR Code di atas</li>
              <li>Tap notifikasi yang muncul</li>
              <li>Website akan terbuka otomatis</li>
            </ol>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full mt-4 sm:mt-6 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}