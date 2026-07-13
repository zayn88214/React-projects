import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Maximize, Minimize, ChevronDown, ChevronUp } from "lucide-react";

// High-quality car images from Unsplash
const CAR_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=675&fit=crop",
    alt: "Red Ferrari 488 GTB",
    title: "Ferrari 488 GTB",
    description: "3.9L Twin-Turbo V8 • 661 HP • 205 MPH",
    specs: { engine: "3.9L Twin-Turbo V8", power: "661 HP", topSpeed: "205 MPH", acceleration: "3.0s 0-60" },
    color: "#DC143C"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=675&fit=crop",
    alt: "Lamborghini Huracán",
    title: "Lamborghini Huracán",
    description: "5.2L V10 • 631 HP • 202 MPH",
    specs: { engine: "5.2L V10", power: "631 HP", topSpeed: "202 MPH", acceleration: "2.9s 0-60" },
    color: "#FF6B00"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=675&fit=crop",
    alt: "Porsche 911 Turbo S",
    title: "Porsche 911 Turbo S",
    description: "3.8L Twin-Turbo Flat-6 • 640 HP • 205 MPH",
    specs: { engine: "3.8L Twin-Turbo Flat-6", power: "640 HP", topSpeed: "205 MPH", acceleration: "2.6s 0-60" },
    color: "#1A1A2E"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&h=675&fit=crop",
    alt: "McLaren 720S",
    title: "McLaren 720S",
    description: "4.0L Twin-Turbo V8 • 710 HP • 212 MPH",
    specs: { engine: "4.0L Twin-Turbo V8", power: "710 HP", topSpeed: "212 MPH", acceleration: "2.8s 0-60" },
    color: "#FF6600"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=675&fit=crop",
    alt: "Audi R8 V10",
    title: "Audi R8 V10 Performance",
    description: "5.2L V10 • 602 HP • 205 MPH",
    specs: { engine: "5.2L V10", power: "602 HP", topSpeed: "205 MPH", acceleration: "3.1s 0-60" },
    color: "#003366"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&h=675&fit=crop",
    alt: "Mercedes-AMG GT",
    title: "Mercedes-AMG GT Black Series",
    description: "4.0L Twin-Turbo V8 • 720 HP • 202 MPH",
    specs: { engine: "4.0L Twin-Turbo V8", power: "720 HP", topSpeed: "202 MPH", acceleration: "3.1s 0-60" },
    color: "#000000"
  }
];

// Preload images for smooth transitions
const preloadImages = (images) => {
  images.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    document.head.appendChild(link);
  });
};

export default function EnhancedImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  const progressIntervalRef = useRef(null);
  const autoplayIntervalRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const AUTOPLAY_INTERVAL = 4000;
  const PROGRESS_UPDATE_INTERVAL = 50;

  // Preload images on mount
  useEffect(() => {
    preloadImages(CAR_IMAGES);
    const loaded = new Set();
    CAR_IMAGES.forEach((img, index) => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => loaded.add(index);
    });
    setLoadedImages(loaded);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || isHovering) return;
    
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += (PROGRESS_UPDATE_INTERVAL / AUTOPLAY_INTERVAL) * 100;
      if (progress >= 100) progress = 0;
      setProgress(progress);
    }, PROGRESS_UPDATE_INTERVAL);
    
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying, isHovering, currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovering) return;
    
    autoplayIntervalRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
    
    return () => clearInterval(autoplayIntervalRef.current);
  }, [isPlaying, isHovering, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current?.contains(document.activeElement) && !isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) toggleFullscreen();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setShowThumbnails(prev => !prev);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex]);

  // Touch/swipe handling
  const handleTouchStart = (e) => {
    setTouchStart(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const swipeThreshold = 50;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CAR_IMAGES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CAR_IMAGES.length) % CAR_IMAGES.length);
    setProgress(0);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const currentCar = CAR_IMAGES[currentIndex];
  const isLoaded = loadedImages.has(currentIndex);

  return (
    <div
      ref={containerRef}
      className={`min-h-[500px] w-full bg-stone-50 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black p-0' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Header */}
      {!isFullscreen && (
        <div className="w-full max-w-5xl mb-6">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Project 04</p>
          <h1 className="text-3xl font-bold text-stone-800">Enhanced Car Showcase</h1>
          <p className="text-sm text-stone-500 mt-1">Swipe, use arrow keys, or press Space to pause • Press F for fullscreen • Press T to toggle thumbnails</p>
        </div>
      )}

      {/* Fullscreen toolbar */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-60 flex items-center gap-2">
          <button
            onClick={toggleShowThumbnails}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
            aria-label="Toggle thumbnails"
          >
            {showThumbnails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
            aria-label="Exit fullscreen"
          >
            <Minimize size={20} />
          </button>
        </div>
      )}

      {/* Main Slider Container */}
      <div
        className={`relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
          isFullscreen ? 'max-w-full max-h-[calc(100vh-120px)] rounded-none' : ''
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-stone-800 to-stone-600 z-10 transition-all duration-300"
          style={{ width: `${progress}%`, transformOrigin: 'left' }}
        />

        {/* Slides Container */}
        <div className="relative w-full h-full">
          {CAR_IMAGES.map((car, index) => (
            <div
              key={car.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === currentIndex
                  ? 'opacity-100 translate-x-0 scale-100 z-10'
                  : index === (currentIndex - 1 + CAR_IMAGES.length) % CAR_IMAGES.length
                  ? 'opacity-0 -translate-x-full scale-95 z-0'
                  : index === (currentIndex + 1) % CAR_IMAGES.length
                  ? 'opacity-0 translate-x-full scale-95 z-0'
                  : 'opacity-0 translate-x-0 scale-95 z-0'
              }`}
              style={{ 
                background: `linear-gradient(135deg, ${car.color}15, ${car.color}05)` 
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${car.src})` }}>
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Car Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: car.color }}
                      />
                      <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                        {car.title.split(' ')[0].toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{car.title}</h2>
                    <p className="text-white/90 text-lg mb-4">{car.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: car.color }} />
                        Engine: {car.specs.engine}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: car.color }} />
                        Power: {car.specs.power}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: car.color }} />
                        Top Speed: {car.specs.topSpeed}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: car.color }} />
                        0-60: {car.specs.acceleration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading placeholder */}
              {!isLoaded && index === currentIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                  <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => { prevSlide(); setIsPlaying(false); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full p-3 shadow-xl transition-all duration-300 hover:shadow-2xl z-20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous car"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={() => { nextSlide(); setIsPlaying(false); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full p-3 shadow-xl transition-all duration-300 hover:shadow-2xl z-20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next car"
        >
          <ChevronRight size={24} />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full p-2 shadow-xl transition-all duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Fullscreen Button */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-stone-800 rounded-full p-2 shadow-xl transition-all duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Enter fullscreen"
          >
            <Maximize size={20} />
          </button>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {CAR_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to ${CAR_IMAGES[index].title}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && (
        <div className={`mt-6 w-full max-w-5xl transition-all duration-300 ${isFullscreen ? 'absolute bottom-16 left-1/2 -translate-x-1/2' : ''}`}>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CAR_IMAGES.map((car, index) => (
              <button
                key={car.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 relative group ${
                  index === currentIndex
                    ? 'border-stone-800 shadow-lg scale-105 z-10'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
                aria-label={`View ${car.title}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
                     style={{ backgroundImage: `url(${car.src})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate">
                  {car.title}
                </div>
                {/* Active indicator */}
                {index === currentIndex && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" 
                       style={{ backgroundColor: car.color }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Thumbnails Button (when hidden) */}
      {!showThumbnails && !isFullscreen && (
        <button
          onClick={() => setShowThumbnails(true)}
          className="mt-4 text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2 transition-colors"
        >
          Show thumbnails
        </button>
      )}

      {/* Keyboard Shortcuts Help (Fullscreen) */}
      {isFullscreen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm flex items-center gap-6 z-50">
          <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> Play/Pause</span>
          <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-white/10 rounded">F</kbd> Fullscreen</span>
          <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-white/10 rounded">T</kbd> Thumbnails</span>
          <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> Exit</span>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
