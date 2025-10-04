'use client';

import { useState, useEffect } from 'react';
import { useSelection } from '@/context/SelectionContext';

export default function PersonalDashboard() {
  const { selection, plots, houseProjects } = useSelection();
  const [uniqueUrl, setUniqueUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Use the actual saved selection ID for the URL
    if (selection.bookingId) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setUniqueUrl(`${baseUrl}/dashboard/${selection.bookingId}`);
    }
  }, [selection]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const selectedPlot = plots.find(p => p.id === selection.plotId);
  const selectedHouse = houseProjects.find(h => h.id === selection.houseProjectId);

  const totalCost = (selectedPlot?.price || 0) + (selectedHouse?.price || 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Поздравляем! Ваш выбор готов!
        </h2>
        <p className="text-lg text-gray-600">
          Вы успешно прошли все этапы выбора. Вот ваш персональный кабинет с выбранными параметрами.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Selection Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ваш выбор
          </h3>

          <div className="space-y-4">
            {selectedPlot && (
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Участок</h4>
                <p className="text-gray-600">{selectedPlot.name}</p>
                <p className="text-sm text-gray-500">Площадь: {selectedPlot.area} m²</p>
                <p className="text-lg font-semibold text-green-600">
                  ${selectedPlot.price.toLocaleString()}
                </p>
              </div>
            )}

            {selection.constructionFormat && (
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Формат строительства</h4>
                <p className="text-gray-600">
                  {selection.constructionFormat === 'self' ? 'Строим сами' : 'Дом под ключ'}
                </p>
              </div>
            )}

            {selectedHouse && (
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Проект дома</h4>
                <p className="text-gray-600">{selectedHouse.name}</p>
                <p className="text-sm text-gray-500">Площадь: {selectedHouse.area} m²</p>
                <p className="text-lg font-semibold text-green-600">
                  ${selectedHouse.price.toLocaleString()}
                </p>
              </div>
            )}

            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-900 mb-2">Статус бронирования</h4>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-600 font-medium">Забронировано</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Просмотр запланирован. Ожидайте подтверждения.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Общая стоимость</h4>
              <p className="text-2xl font-bold text-green-600">
                ${totalCost.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Personal URL */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Персональная ссылка
          </h3>
          <p className="text-gray-600 mb-4">
            Сохраните эту ссылку, чтобы в любой момент вернуться к вашему выбору
          </p>

          <div className="bg-gray-50 border rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-800 break-all">
              {uniqueUrl}
            </p>
          </div>

          <button
            onClick={copyToClipboard}
            className={`
              w-full px-4 py-2 rounded-lg font-medium transition-colors
              ${copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {copied ? '✓ Скопировано!' : 'Скопировать ссылку'}
          </button>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 Эта ссылка уникальна для вашего выбора и позволит вам или вашему менеджеру
              быстро получить доступ ко всем деталям вашего проекта.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Следующие шаги
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Подтверждение</h4>
            <p className="text-sm text-gray-600">
              Мы свяжемся с вами в ближайшее время для подтверждения просмотра
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Просмотр участка</h4>
            <p className="text-sm text-gray-600">
              Посетите выбранный участок с нашим специалистом
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Заключение договора</h4>
            <p className="text-sm text-gray-600">
              Подписание документов и начало реализации проекта
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Свяжитесь с нами
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Телефон</h4>
            <p className="text-gray-600">+380(99) 123-45-67</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Email</h4>
            <p className="text-gray-600">info@sonya.com.ua</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Адрес офиса</h4>
            <p className="text-gray-600">г. Киев, ул. Гетмана Павла Скоропадского, 15</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-green-100 border border-green-200 rounded-lg">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-800 font-medium">
            Спасибо за выбор Sonya! Мы рады помочь вам создать дом вашей мечты.
          </span>
        </div>
      </div>
    </div>
  );
}
