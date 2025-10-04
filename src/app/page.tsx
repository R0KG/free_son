'use client';

import { useState } from 'react';
import { useSelection } from '@/context/SelectionContext';
import InteractiveMap from '@/components/InteractiveMap';
import ConstructionFormatStep from '@/components/ConstructionFormatStep';
import HouseSelection from '@/components/HouseSelection';
import BookingStep from '@/components/BookingStep';
import PersonalDashboard from '@/components/PersonalDashboard';

type Step = 'landing' | 'plot' | 'construction' | 'house' | 'booking' | 'dashboard';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const { selection, updateSelection, resetSelection, plots } = useSelection();

  const handleNext = () => {
    switch (currentStep) {
      case 'landing':
        setCurrentStep('plot');
        break;
      case 'plot':
        if (selection.plotId) setCurrentStep('construction');
        break;
      case 'construction':
        if (selection.constructionFormat) setCurrentStep('house');
        break;
      case 'house':
        if (selection.houseProjectId) setCurrentStep('booking');
        break;
      case 'booking':
        setCurrentStep('dashboard');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'plot':
        setCurrentStep('landing');
        break;
      case 'construction':
        setCurrentStep('plot');
        break;
      case 'house':
        setCurrentStep('construction');
        break;
      case 'booking':
        setCurrentStep('house');
        break;
      case 'dashboard':
        setCurrentStep('booking');
        break;
    }
  };

  const handleReset = () => {
    resetSelection();
    setCurrentStep('landing');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'plot':
        return !!selection.plotId;
      case 'construction':
        return !!selection.constructionFormat;
      case 'house':
        return !!selection.houseProjectId;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen gradient-premium-subtle ios-safe-area">
      {/* Header */}
      <header className="bg-white shadow-sm border-b ios-safe-area">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors cursor-pointer ios-breakpoint-standard">
              Sonya Project
            </h1>
            <div className="flex space-x-4">
              {currentStep !== 'landing' && currentStep !== 'dashboard' && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-emerald-300 transition-colors ios-button tap-highlight-none"
                >
                  Назад
                </button>
              )}
              {currentStep === 'dashboard' && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-emerald-300 transition-colors ios-button tap-highlight-none"
                >
                  Начать заново
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep !== 'landing' && currentStep !== 'dashboard' && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Шаг {['plot', 'construction', 'house', 'booking'].indexOf(currentStep) + 1} из 4</span>
                <span>
                  {currentStep === 'plot' && 'Выбор участка'}
                  {currentStep === 'construction' && 'Формат строительства'}
                  {currentStep === 'house' && 'Дом мечты'}
                  {currentStep === 'booking' && 'Бронирование просмотра'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((['plot', 'construction', 'house', 'booking'].indexOf(currentStep) + 1) / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8 ios-breakpoint-standard min-h-screen">
        {currentStep === 'landing' && (
          <div className="text-center animate-fade-in">
            {/* Hero Section with Background */}
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-purple-50 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
                <div className="inline-flex items-center justify-center w-20 h-20 gradient-emerald-sapphire rounded-full mb-8 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Добро пожаловать в <span className="gradient-text-fallback">Sonya Project!</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
                  Создайте дом своей мечты в несколько простых шагов.
                </p>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-bold">1</span>
                      </div>
                      <span className="text-gray-700">Выберите участок</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-slate-700 font-bold">2</span>
                      </div>
                      <span className="text-gray-700">Выберите формат</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-700 font-bold">3</span>
                      </div>
                      <span className="text-gray-700">Выберите дом</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Профессиональная команда поможет вам на каждом этапе.
                  От выбора идеального участка до бронирования просмотра — мы сделаем процесс простым и приятным.
                </p>

                <button
                  onClick={() => setCurrentStep('plot')}
                  className="group relative gradient-emerald-sapphire text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden ios-button tap-highlight-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Начать выбор участка
                    <svg className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>

                <p className="text-sm text-gray-500 mt-4">
                  Бесплатная консультация • Без скрытых платежей • Гарантия качества
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-16 h-16 gradient-emerald-sapphire rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Быстрый выбор</h3>
                <p className="text-gray-600 text-sm">Интерактивная карта и удобный интерфейс помогут выбрать участок за минуты</p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-16 h-16 gradient-gold-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Прозрачные цены</h3>
                <p className="text-gray-600 text-sm">Все цены указаны сразу, без скрытых платежей и неожиданных расходов</p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-16 h-16 gradient-rose-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Персональный подход</h3>
                <p className="text-gray-600 text-sm">Каждому клиенту — индивидуальное сопровождение и консультации</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'plot' && (
          <div className="space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                Выберите участок своей мечты
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
                Кликните на свободный участок на интерактивной карте, чтобы выбрать его.
                Каждый участок имеет уникальные характеристики и преимущества.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 ios-breakpoint-standard h-full">
              {/* Interactive Map */}
              <div className="md:col-span-2 lg:col-span-3">
                <InteractiveMap
                  selectedPlot={selection.plotId}
                  onPlotSelect={(plot) => updateSelection({ plotId: plot.id })}
                  className="w-full"
                  height={typeof window !== 'undefined' && window.innerWidth < 768 ? '80vh' :
                          typeof window !== 'undefined' && window.innerWidth < 1024 ? '75vh' : '75vh'}
                />
              </div>

              {/* Plot Details Sidebar */}
              <div className="md:col-span-1 lg:col-span-1 order-first lg:order-last block lg:block">
                <div className="bg-white rounded-2xl shadow-xl p-1 md:p-4 lg:p-6 border border-gray-100 lg:sticky lg:top-8 w-full max-w-full plot-details-mobile plot-details-se">
                  <div className="flex items-center mb-1 md:mb-4 lg:mb-6">
                    <div className="w-4 h-4 md:w-8 md:h-8 lg:w-10 lg:h-10 gradient-emerald-sapphire rounded-xl flex items-center justify-center mr-1 md:mr-2 lg:mr-3">
                      <svg className="w-2 h-2 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs md:text-lg lg:text-xl font-bold text-gray-900">
                      Детали участка
                    </h3>
                  </div>

                  {selection.plotId ? (
                    (() => {
                      const selectedPlot = plots.find(p => p.id === selection.plotId);
                      return selectedPlot ? (
                        <div className="space-y-1 md:space-y-4 lg:space-y-6">
                          {/* Plot Header */}
                          <div className="text-center p-1 md:p-3 lg:p-4 gradient-emerald-sapphire rounded-xl border border-emerald-200">
                            <h4 className="text-xs md:text-lg lg:text-xl font-bold text-gray-900 mb-0.5 md:mb-1 truncate">{selectedPlot.name}</h4>
                            <p className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-2 hidden sm:block">{selectedPlot.description}</p>
                            <div className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] md:text-sm font-medium">
                              <svg className="w-1.5 w-1.5 md:w-3 md:h-3 lg:w-4 lg:h-4 mr-0.5 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Доступен
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-0.5 md:gap-2 lg:gap-4">
                            <div className="text-center p-0.5 md:p-2 lg:p-3 bg-emerald-50 rounded-lg">
                              <div className="text-sm md:text-xl lg:text-2xl font-bold text-emerald-700 mb-0 md:mb-1">{selectedPlot.area}</div>
                              <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-wide">Площадь</div>
                              <div className="text-[9px] md:text-xs text-gray-600 mt-0 md:mt-1">м²</div>
                            </div>
                            <div className="text-center p-0.5 md:p-2 lg:p-3 bg-slate-50 rounded-lg">
                              <div className="text-sm md:text-xl lg:text-2xl font-bold text-slate-700 mb-0 md:mb-1">
                                {Math.round(selectedPlot.price / selectedPlot.area)}
                              </div>
                              <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-wide">Цена за м²</div>
                              <div className="text-[9px] md:text-xs text-gray-600 mt-0 md:mt-1">$</div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="border-t pt-1 md:pt-3 lg:pt-4">
                            <div className="text-center">
                              <div className="text-sm md:text-2xl lg:text-3xl font-bold text-emerald-700 mb-0 md:mb-1">
                                ${selectedPlot.price.toLocaleString()}
                              </div>
                              <div className="text-[9px] md:text-sm text-gray-600">Цена</div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="border-t pt-1 md:pt-3 lg:pt-4">
                            <h5 className="font-semibold text-gray-900 mb-0.5 md:mb-2 lg:mb-3 flex items-center">
                              <svg className="w-1.5 w-1.5 md:w-3 md:h-3 lg:w-4 lg:h-4 mr-0.5 md:mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[10px] md:text-sm lg:text-base">Особенности:</span>
                            </h5>
                            <ul className="space-y-0.5 md:space-y-1 lg:space-y-2">
                              {selectedPlot.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-[10px] md:text-sm text-gray-600">
                                  <span className="w-0.5 h-0.5 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-emerald-600 rounded-full mr-0.5 md:mr-2"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={handleNext}
                            className="w-full gradient-emerald-sapphire text-white py-1.5 md:py-3 lg:py-4 px-2 md:px-4 lg:px-6 rounded-xl text-[10px] md:text-sm lg:text-base font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-200 ios-button tap-highlight-none"
                          >
                            <span className="flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 md:w-4 md:h-4 lg:w-5 lg:h-5 mr-0.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              Продолжить
                            </span>
                          </button>
                        </div>
                      ) : null;
                    })()
                  ) : (
                    <div className="text-center py-4 md:py-8 lg:py-12">
                      <div className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4">
                        <svg className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-xs md:text-sm lg:text-base">Выберите участок</h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        Кликните на зеленый участок на карте
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {currentStep === 'construction' && <ConstructionFormatStep onNext={handleNext} />}
        {currentStep === 'house' && <HouseSelection onNext={handleNext} />}
        {currentStep === 'booking' && <BookingStep onNext={handleNext} />}
        {currentStep === 'dashboard' && <PersonalDashboard />}
      </main>
    </div>
  );
}
