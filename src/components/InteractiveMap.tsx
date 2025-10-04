'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plot } from '@/types';
import { useSelection } from '@/context/SelectionContext';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Note: Leaflet will be imported inside useEffect to avoid SSR issues

interface InteractiveMapProps {
  selectedPlot?: string | null;
  onPlotSelect?: (plot: Plot) => void;
  className?: string;
  height?: string | number;
}

export default function InteractiveMap({ selectedPlot, onPlotSelect, className = '', height = '100vh' }: InteractiveMapProps) {
  const { plots, updateSelection } = useSelection();
  const [mounted, setMounted] = useState(false);
  const [selectedPlotData, setSelectedPlotData] = useState<Plot | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [IconClass, setIconClass] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Load Leaflet CSS and Icon class
    const loadLeaflet = async () => {
      try {
        // Import CSS as a side effect first
        if (typeof window !== 'undefined') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        const L = await import('leaflet');
        setIconClass(() => L.Icon);
        setLeafletLoaded(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };
    loadLeaflet();
  }, []);

  const handlePlotClick = (plot: Plot) => {
    setSelectedPlotData(plot);
    updateSelection({ plotId: plot.id });
    onPlotSelect?.(plot);
  };

  // Custom marker icons for different statuses
  const createCustomIcon = (plot: Plot, isSelected: boolean = false) => {
    if (!IconClass) return null;

    const color = plot.available ? '#064e3b' : '#be123c';
    const icon = plot.available ? '🏠' : '❌';

    const iconSize = isSelected ? [50, 50] as [number, number] : [40, 40] as [number, number];
    const iconAnchor = isSelected ? [25, 25] as [number, number] : [20, 20] as [number, number];

    // Create SVG data URL with proper Unicode encoding
    const svgString = `
      <svg width="${iconSize[0]}" height="${iconSize[1]}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${iconSize[0]/2}" cy="${iconSize[1]/2}" r="${iconSize[0]/2 - 3}" fill="${color}" stroke="white" stroke-width="3"/>
        <text x="${iconSize[0]/2}" y="${iconSize[1]/2 + 6}" text-anchor="middle" fill="white" font-size="${isSelected ? '20' : '16'}" font-weight="bold">${icon}</text>
      </svg>
    `;

    // Convert Unicode string to binary string that btoa() can handle
    const encodedSvg = unescape(encodeURIComponent(svgString.trim()));

    // Create and return a proper Leaflet Icon instance
    return new IconClass({
      iconUrl: `data:image/svg+xml;base64,${btoa(encodedSvg)}`,
      iconSize,
      iconAnchor,
      popupAnchor: [0, -20]
    });
  };

  if (!mounted || !IconClass) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height: '600px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка карты...</p>
        </div>
      </div>
    );
  }

  // iPhone-specific height calculation
  const mapHeight = typeof height === 'number' ? `${height}px` : height;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const isIPhone = typeof window !== 'undefined' && (
    window.innerWidth <= 428 && window.innerHeight <= 926 ||
    window.innerWidth <= 375 && window.innerHeight <= 812 ||
    window.innerWidth <= 390 && window.innerHeight <= 844
  );

  return (
    <div
      className={`relative ${className} flex flex-col`}
      style={{
        height: mapHeight,
        minHeight: isIPhone ? '500px' : isMobile ? '450px' : isTablet ? '450px' : '500px'
      }}
    >
      {/* Selection Call-to-Action - iPhone optimized */}
      <div className={`absolute ${isIPhone ? 'top-1 left-1 right-1' : isMobile ? 'top-2 left-2 right-2' : 'top-2 left-15'} z-[1000] bg-green-50/95 backdrop-blur-sm rounded-xl p-2 md:p-4 shadow-xl border border-green-200 ${isIPhone ? 'w-[calc(100vw-0.5rem)]' : ''}`}>
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">👆</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-green-900 text-xs">Выберите участок</h3>
            <p className="text-green-700 text-xs hidden md:block">Кликните на зеленый маркер</p>
          </div>
        </div>
      </div>

      {/* Map Legend - iPhone optimized */}
      <div className={`absolute ${isIPhone ? 'bottom-1 left-1' : isMobile ? 'bottom-2 left-2' : 'bottom-4 left-4'} z-[1000] bg-white/95 backdrop-blur-sm rounded-xl p-1 md:p-2 lg:p-4 shadow-xl border border-white/20 ${isIPhone ? 'w-[calc(100vw-0.5rem)] max-w-[calc(100vw-0.5rem)]' : isMobile ? 'max-w-[calc(100vw-1rem)]' : ''} ${isIPhone ? 'stats-card-mobile stats-card-se' : ''}`}>
        <h3 className="font-bold text-gray-900 mb-1 md:mb-2 lg:mb-3 text-xs">Статус</h3>
        <div className={`space-y-1 md:space-y-2 lg:space-y-3 text-xs ${isIPhone ? 'space-y-0.5' : ''}`}>
          <div className={`flex items-center ${isIPhone ? 'space-x-0.5' : 'space-x-1 md:space-x-2'}`}>
            <div
              className={`${isIPhone ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6'} rounded-full border-2 border-white shadow-sm flex-shrink-0`}
              style={{ backgroundColor: '#22c55e' }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs">
                🏠
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-gray-800 font-semibold block ${isIPhone ? 'text-[10px]' : 'text-xs'}`}>Доступные</span>
              <span className={`text-gray-600 ${isIPhone ? 'text-[9px] hidden' : 'text-xs hidden md:block'}`}>Можно выбрать</span>
            </div>
          </div>

          <div className={`flex items-center ${isIPhone ? 'space-x-0.5' : 'space-x-1 md:space-x-2'}`}>
            <div
              className={`${isIPhone ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6'} rounded-full border-2 border-white shadow-sm flex-shrink-0`}
              style={{ backgroundColor: '#eab308' }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs">
                ⏳
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-gray-800 font-semibold block ${isIPhone ? 'text-[10px]' : 'text-xs'}`}>Забронированные</span>
              <span className={`text-gray-600 ${isIPhone ? 'text-[9px] hidden' : 'text-xs hidden md:block'}`}>В процессе</span>
            </div>
          </div>

          <div className={`flex items-center ${isIPhone ? 'space-x-0.5' : 'space-x-1 md:space-x-2'}`}>
            <div
              className={`${isIPhone ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6'} rounded-full border-2 border-white shadow-sm flex-shrink-0`}
              style={{ backgroundColor: '#ef4444' }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs">
                ✅
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-gray-800 font-semibold block ${isIPhone ? 'text-[10px]' : 'text-xs'}`}>Проданные</span>
              <span className={`text-gray-600 ${isIPhone ? 'text-[9px] hidden' : 'text-xs hidden md:block'}`}>Уже куплены</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Statistics - iPhone optimized */}
      <div className={`absolute ${isIPhone ? 'top-1 right-1' : isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-[1000] bg-white/95 backdrop-blur-sm rounded-xl p-1 md:p-2 lg:p-4 shadow-xl border border-white/20 ${isIPhone ? 'w-[calc(100vw-0.5rem)] max-w-[calc(100vw-0.5rem)] stats-card-mobile stats-card-se' : isMobile ? 'max-w-[calc(100vw-4rem)]' : ''}`}>
        <h3 className="font-bold text-gray-900 mb-0.5 md:mb-1 lg:mb-3 text-xs">Участки</h3>
        <div className={`space-y-0.5 md:space-y-1 lg:space-y-2 text-xs ${isIPhone ? 'space-y-0.5' : ''}`}>
          <div className={`flex justify-between ${isIPhone ? 'gap-1' : ''}`}>
            <span className={`text-gray-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>Всего:</span>
            <span className={`font-bold text-gray-900 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>{plots.length}</span>
          </div>
          <div className={`flex justify-between ${isIPhone ? 'gap-1' : ''}`}>
            <span className={`text-green-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>🏠 Доступно:</span>
            <span className={`font-bold text-green-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>{plots.filter(p => p.available).length}</span>
          </div>
          <div className={`flex justify-between ${isIPhone ? 'gap-1' : ''}`}>
            <span className={`text-yellow-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>⏳ Забронировано:</span>
            <span className={`font-bold text-yellow-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>{plots.filter(p => !p.available).length}</span>
          </div>
          <div className={`flex justify-between ${isIPhone ? 'gap-1' : ''}`}>
            <span className={`text-red-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>✅ Продано:</span>
            <span className={`font-bold text-red-600 ${isIPhone ? 'text-[10px] leading-tight' : 'text-xs'}`}>0</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div id="interactive-map-container" className={`rounded-xl shadow-lg overflow-hidden ios-scroll flex-1 ${className}`}>
        <MapContainer
          key="main-interactive-map"
          center={[50.4501, 30.5234]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="touch-friendly"
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {plots.map((plot) => {
          const isSelected = selectedPlot === plot.id;

          const icon = createCustomIcon(plot, isSelected);

          return (
            <Marker
              key={plot.id}
              position={[plot.coordinates.x, plot.coordinates.y]}
              eventHandlers={{
                click: () => handlePlotClick(plot)
              }}
              icon={icon}
            >
              <Popup>
                <div className={`${isIPhone ? 'p-1.5 min-w-[100px] max-w-[calc(100vw-2rem)] w-[calc(100vw-2rem)]' : isMobile ? 'p-2 min-w-[120px] max-w-[200px]' : 'p-2 min-w-[250px]'}`}>
                  <div className="flex items-center mb-1 md:mb-2">
                    <div
                      className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full mr-1 md:mr-2 flex-shrink-0"
                      style={{ backgroundColor: plot.available ? '#22c55e' : '#ef4444' }}
                    />
                    <h3 className="font-bold text-xs md:text-sm lg:text-lg text-gray-900 truncate">{plot.name}</h3>
                  </div>

                  <div className="space-y-0.5 md:space-y-1 lg:space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Статус:</span>
                      <span className="font-semibold text-xs" style={{ color: plot.available ? '#22c55e' : '#ef4444' }}>
                        {plot.available ? 'Доступен' : 'Недоступен'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Площадь:</span>
                      <span className="font-semibold text-gray-900 text-xs">{plot.area} м²</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Цена:</span>
                      <span className="font-bold text-green-600 text-xs">${plot.price.toLocaleString()}</span>
                    </div>

                    <div className="pt-1 md:pt-2 border-t border-gray-200">
                      <div className="text-gray-600 mb-0.5 text-xs">Особенности:</div>
                      <div className="flex flex-wrap gap-0.5">
                        {plot.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {plot.features.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs">
                            +{plot.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-1 md:pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 line-clamp-1">{plot.description}</p>
                    </div>

                    {plot.available && (
                      <div className="pt-1 md:pt-2 border-t border-green-200 bg-green-50 p-1 md:p-2 rounded-lg">
                        <p className="text-xs text-green-800 font-semibold text-center">
                          ✨ Доступен!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        </MapContainer>
      </div>

      {/* Selected Plot Details - iPhone optimized */}
      {selectedPlotData && (
        <div className={`absolute ${isIPhone ? 'bottom-1 left-1 right-1' : isMobile ? 'bottom-2 left-2 right-2' : 'bottom-3 right-3'} z-[1000] bg-white/95 backdrop-blur-sm rounded-xl p-1 md:p-2 lg:p-4 shadow-xl border border-white/20 ${isIPhone ? 'w-[calc(100vw-0.5rem)] max-w-[calc(100vw-0.5rem)]' : isMobile ? 'max-w-[calc(100vw-1rem)]' : 'w-[280px] max-w-sm'}`}>
          <div className="flex items-start justify-between mb-1 md:mb-2 lg:mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm md:text-lg text-gray-900 truncate">{selectedPlotData.name}</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1 hidden sm:block">{selectedPlotData.description}</p>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0 ml-2">
              <span
                className="px-2 py-1 rounded-full text-xs md:text-sm font-semibold text-white whitespace-nowrap"
                style={{ backgroundColor: selectedPlotData.available ? '#22c55e' : '#ef4444' }}
              >
                {selectedPlotData.available ? 'Доступен' : 'Недоступен'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
            <div>
              <span className="text-gray-600">Площадь:</span>
              <span className="font-bold text-gray-900 ml-1 md:ml-2">{selectedPlotData.area} м²</span>
            </div>
            <div>
              <span className="text-gray-600">Цена:</span>
              <span className="font-bold text-green-600 ml-1 md:ml-2">${selectedPlotData.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2 md:mt-3">
            <div className="text-xs text-gray-600 mb-1">Особенности:</div>
            <div className="flex flex-wrap gap-1">
              {selectedPlotData.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {selectedPlotData.available && (
            <div className="mt-3 md:mt-4 p-2 md:p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs md:text-sm text-green-800 font-semibold text-center">
                🎉 Поздравляем! Вы выбрали этот участок
              </p>
              <p className="text-xs text-green-700 text-center mt-1">
                Свяжитесь с нами для оформления покупки
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
