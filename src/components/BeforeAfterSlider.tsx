import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterProps {
  key?: React.Key;
  beforeImg: string;
  afterImg: string;
  title: string;
  description: string;
  treatment: string;
}

export default function BeforeAfterSlider({ beforeImg, afterImg, title, description, treatment }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0-100)
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Slider Interactive Area */}
      <div 
        ref={containerRef}
        className="relative h-64 sm:h-72 w-full overflow-hidden select-none cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Full width background) */}
        <img 
          src={afterImg} 
          alt="Después del tratamiento" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute right-4 top-4 bg-emerald-500/90 text-white font-medium text-xs px-2.5 py-1 rounded-full shadow-sm z-10 uppercase tracking-wider">
          Después
        </div>

        {/* Before Image (Clip width based on sliderPosition) */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={beforeImg} 
            alt="Antes del tratamiento" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current?.getBoundingClientRect().width || '100vw', maxWidth: 'none' }}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute left-4 top-4 bg-slate-800/90 text-white font-medium text-xs px-2.5 py-1 rounded-full shadow-sm z-10 uppercase tracking-wider">
          Antes
        </div>

        {/* Dynamic Drag Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)] z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 font-bold text-sm">
            ↔
          </div>
        </div>
      </div>

      {/* Description Info */}
      <div className="p-5 flex-grow flex flex-col justify-between bg-slate-50">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            {treatment}
          </span>
          <h4 className="mt-3 font-semibold text-slate-800 text-base leading-tight">
            {title}
          </h4>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Desliza para comparar</span>
          <span className="text-blue-500 font-semibold">★ Sabor Real</span>
        </div>
      </div>
    </div>
  );
}
