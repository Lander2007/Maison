import React, { useState, useRef, useEffect } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

// prefer a local static placeholder served from public/
const LOCAL_FALLBACK = "/assets/placeholder.svg";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const { src, alt, style, className, ...rest } = props;

  const [didError, setDidError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    src ?? undefined,
  );
  const [attempt, setAttempt] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src ?? undefined);
  }, [src]);

  const handleError = () => {
    // Log the failure to help debugging in dev console
    // eslint-disable-next-line no-console
    console.warn("Image failed to load:", currentSrc);

    if (attempt === 0 && currentSrc) {
      // Try one retry with cache-bust (helps flaky CDN/hotlink issues)
      const sep = currentSrc.includes("?") ? "&" : "?";
      setAttempt(1);
      setCurrentSrc(`${currentSrc}${sep}cachebust=${Date.now()}`);
      return;
    }

    setDidError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // If the image was already loaded before React hydrated
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  if (didError || !currentSrc) {
    const fallback = LOCAL_FALLBACK || ERROR_IMG_SRC;
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={fallback}
            alt="Placeholder image"
            {...rest}
            data-original-url={currentSrc ?? src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 1,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      {...rest}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
