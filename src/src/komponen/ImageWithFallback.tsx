import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = '' }: Props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackImage = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400';

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={error ? fallbackImage : src}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
