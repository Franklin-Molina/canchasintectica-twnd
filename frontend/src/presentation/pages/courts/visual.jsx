import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, List, Play, Pause, X, ChevronLeft, ChevronRight, RotateCw, Filter } from 'lucide-react';

const ImageFlow = () => {
  const [images] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800', title: 'Cancha de Fútbol', date: '2024-03-15', location: 'Bogotá' },
    { id: 2, url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', title: 'Estadio Moderno', date: '2024-03-14', location: 'Madrid' },
    { id: 3, url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', title: 'Campo Verde', date: '2024-03-13', location: 'Barcelona' },
    { id: 4, url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', title: 'Entrenamiento', date: '2024-03-12', location: 'Londres' },
    { id: 5, url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', title: 'Vista Aérea', date: '2024-03-11', location: 'París' },
    { id: 6, url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', title: 'Estadio Nocturno', date: '2024-03-10', location: 'Milán' }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('lightbox'); // lightbox, grid, timeline
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [filter, setFilter] = useState('none');
  const [showInfo, setShowInfo] = useState(true);
  const [dragStart, setDragStart] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Autoplay slideshow
  useEffect(() => {
    let interval;
    if (isPlaying && viewMode === 'lightbox') {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setZoom(1);
        setImagePosition({ x: 0, y: 0 });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (viewMode !== 'lightbox') return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          setViewMode('grid');
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetImageTransform();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetImageTransform();
  };

  const resetImageTransform = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setImagePosition({ x: 0, y: 0 });
    setFilter('none');
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
    if (zoom <= 1) setImagePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    if (viewMode !== 'lightbox') return;
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e) => {
    if (dragStart && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  const filterStyles = {
    none: '',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    brightness: 'brightness(1.3)',
    contrast: 'contrast(1.3)',
    vintage: 'sepia(50%) contrast(1.2) brightness(0.9)'
  };

  const currentImage = images[currentIndex];

  if (viewMode === 'grid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">ImageFlow Gallery</h1>
              <p className="text-gray-300">{images.length} imágenes en tu colección</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('timeline')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                title="Vista Timeline"
              >
                <List size={20} />
              </button>
              <button
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all"
                title="Vista Grid (Actual)"
              >
                <Grid3x3 size={20} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setViewMode('lightbox');
                  resetImageTransform();
                }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                    <p className="text-gray-300 text-sm">{image.location} • {image.date}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {index + 1}/{images.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'timeline') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Vista Timeline</h1>
              <p className="text-gray-300">Cronología de tus imágenes</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                title="Vista Grid"
              >
                <Grid3x3 size={20} />
              </button>
              <button
                className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-all"
                title="Vista Timeline (Actual)"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setViewMode('lightbox');
                  resetImageTransform();
                }}
                className="flex gap-6 items-start group cursor-pointer"
              >
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-white font-semibold">{image.date}</div>
                  <div className="text-gray-400 text-sm">{image.location}</div>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-1 h-full bg-indigo-500 absolute left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-4 h-4 bg-indigo-500 rounded-full relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                </div>
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">Haz clic para ver en pantalla completa</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Lightbox Mode
  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Volver a Grid"
            >
              <Grid3x3 size={20} />
            </button>
            {showInfo && (
              <div className="text-white">
                <h2 className="text-xl font-semibold">{currentImage.title}</h2>
                <p className="text-sm text-gray-300">{currentImage.location} • {currentImage.date}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white text-sm bg-white/10 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Toggle Info"
            >
              <Filter size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ cursor: zoom > 1 ? (dragStart ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          ref={imageRef}
          src={currentImage.url}
          alt={currentImage.title}
          onMouseDown={handleMouseDown}
          className="max-w-full max-h-full object-contain select-none transition-all duration-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`,
            filter: filterStyles[filter]
          }}
          draggable="false"
        />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all backdrop-blur-sm"
        title="Anterior (←)"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all backdrop-blur-sm"
        title="Siguiente (→)"
      >
        <ChevronRight size={32} />
      </button>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="max-w-4xl mx-auto">
          {/* Thumbnails */}
          <div className="flex gap-2 justify-center mb-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.title}
                onClick={() => {
                  setCurrentIndex(index);
                  resetImageTransform();
                }}
                className={`h-16 w-24 object-cover rounded-lg cursor-pointer transition-all ${
                  index === currentIndex
                    ? 'ring-4 ring-purple-500 scale-110'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={handleZoomOut}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Zoom Out (-)"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Zoom In (+)"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => setRotation(prev => prev + 90)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Rotar"
            >
              <RotateCw size={20} />
            </button>
            <button
              onClick={() => setFlipH(!flipH)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Voltear"
            >
              ⇄
            </button>

            <div className="w-px h-8 bg-white/20"></div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all border border-white/20"
            >
              <option value="none">Sin Filtro</option>
              <option value="grayscale">Blanco y Negro</option>
              <option value="sepia">Sepia</option>
              <option value="brightness">Brillo</option>
              <option value="contrast">Contraste</option>
              <option value="vintage">Vintage</option>
            </select>

            <div className="w-px h-8 bg-white/20"></div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={() => {
                setZoom(1);
                setImagePosition({ x: 0, y: 0 });
              }}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Ajustar a pantalla"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFlow;