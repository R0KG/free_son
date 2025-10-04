'use client';

import { useSelection } from '@/context/SelectionContext';

interface ConstructionFormatStepProps {
  onNext: () => void;
}

export default function ConstructionFormatStep({ onNext }: ConstructionFormatStepProps) {
  const { selection, updateSelection } = useSelection();

  const handleFormatSelect = (format: 'self' | 'turnkey') => {
    updateSelection({ constructionFormat: format });
  };

  const handleNext = () => {
    if (selection.constructionFormat) {
      onNext();
    }
  };

  const formats = [
    {
      id: 'self',
      title: 'Строим сами',
      description: 'Вы получаете готовый участок с коммуникациями и строите дом самостоятельно',
      benefits: [
        'Экономия на строительстве',
        'Полный контроль над процессом',
        'Возможность выбора подрядчиков',
        'Гибкость в материалах и дизайне'
      ],
      drawbacks: [
        'Требуются знания в строительстве',
        'Больше времени на реализацию',
        'Необходимость координации работ'
      ],
      price: 'Участок + материалы',
    },
    {
      id: 'turnkey',
      title: 'Дом под ключ',
      description: 'Полностью готовый дом с отделкой и всеми коммуникациями',
      benefits: [
        'Минимальные хлопоты',
        'Гарантия качества',
        'Быстрые сроки сдачи',
        'Полный пакет документов'
      ],
      drawbacks: [
        'Выше стоимость',
        'Меньше возможностей для кастомизации',
        'Зависимость от подрядчика'
      ],
      price: 'Участок + строительство',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Выберите формат строительства
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Определитесь, как вы хотите реализовать свой проект.
          Каждый формат имеет свои особенности и преимущества.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {formats.map((format) => (
          <div
            key={format.id}
            className={`
              relative bg-white rounded-2xl shadow-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group
              ${selection.constructionFormat === format.id
                ? 'border-green-500 shadow-green-100 shadow-2xl transform scale-105'
                : 'border-gray-200 hover:border-green-300 hover:shadow-2xl'
              }
            `}
            onClick={() => handleFormatSelect(format.id as 'self' | 'turnkey')}
          >
            {/* Header */}
            <div className={`
              px-6 py-4 border-b
              ${selection.constructionFormat === format.id
                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {format.title}
                </h3>
                {selection.constructionFormat === format.id && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-2">
                {format.description}
              </p>
            </div>

            <div className="p-6">
              {/* Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Преимущества:
                </h4>
                <ul className="space-y-2">
                  {format.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Considerations */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Что учесть:
                </h4>
                <ul className="space-y-2">
                  {format.drawbacks.map((drawback, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </span>
                      {drawback}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and Selection */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {format.price}
                    </p>
                    <p className="text-sm text-gray-500">Включает все основные расходы</p>
                  </div>
                  {selection.constructionFormat === format.id && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                      Выбран ✓
                    </div>
                  )}
                </div>

                {/* Recommended badge */}
                {format.id === 'turnkey' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-blue-800 font-medium">
                        Рекомендуем для большинства клиентов
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl
            `}></div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="text-center mb-12">
        <button
          onClick={handleNext}
          disabled={!selection.constructionFormat}
          className={`
            inline-flex items-center px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform
            ${selection.constructionFormat
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Продолжить выбор дома
        </button>

        {!selection.constructionFormat && (
          <p className="text-sm text-gray-500 mt-3">
            ⚠️ Выберите формат строительства для продолжения
          </p>
        )}
      </div>

      {/* Enhanced Comparison Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Детальное сравнение форматов
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Сравните ключевые параметры для принятия оптимального решения
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cost Comparison */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Стоимость</h4>
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <p className="text-sm font-semibold text-red-800">Самостоятельно</p>
                  <p className="text-xs text-red-600">Ниже начальная стоимость</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-sm font-semibold text-green-800">Под ключ</p>
                  <p className="text-xs text-green-600">Фиксированная цена</p>
                </div>
              </div>
            </div>

            {/* Timeline Comparison */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Сроки реализации</h4>
              <div className="space-y-3">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-sm font-semibold text-orange-800">Самостоятельно</p>
                  <p className="text-xs text-orange-600">6-12 месяцев</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm font-semibold text-blue-800">Под ключ</p>
                  <p className="text-xs text-blue-600">3-6 месяцев</p>
                </div>
              </div>
            </div>

            {/* Involvement Comparison */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Ваше участие</h4>
              <div className="space-y-3">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-sm font-semibold text-yellow-800">Самостоятельно</p>
                  <p className="text-xs text-yellow-600">Активное управление</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <p className="text-sm font-semibold text-purple-800">Под ключ</p>
                  <p className="text-xs text-purple-600">Минимальное участие</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">
                  💡 Рекомендация от экспертов
                </h4>
                <p className="text-blue-800 leading-relaxed">
                  <strong>Для большинства клиентов</strong> мы рекомендуем формат "Под ключ".
                  Это гарантирует качество, соблюдение сроков и отсутствие неожиданных расходов.
                  Вы получаете готовый дом без хлопот, а мы берем на себя все организационные вопросы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
