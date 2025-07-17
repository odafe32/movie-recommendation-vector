"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

function ImageWithFallback({
  src,
  alt,
  className = "",
  width = 300,
  height = 450,
  fallbackSrc = "/placeholder-movie.png",
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Ensure alt is never empty or undefined
  const imageAlt = alt || "Movie poster";

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {hasError ? (
        <div
          className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg"
          style={{ width: width, height: height }}
        >
          <div className="text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      ) : (
        <Image
          src={imgSrc}
          alt={imageAlt}
          width={width}
          height={height}
          className={className}
          onError={handleError}
          priority={false}
        />
      )}
    </div>
  );
}

export default ImageWithFallback;
