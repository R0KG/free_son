'use client';

import { useState } from 'react';
import { useSelection } from '@/context/SelectionContext';

interface BookingStepProps {
  onNext: () => void;
}

export default function BookingStep({ onNext }: BookingStepProps) {
  const { selection, updateSelection } = useSelection();
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    selectedDate: '',
    selectedTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.selectedDate || !bookingData.selectedTime) {
      return;
    }

    try {
      // Save to backend
      const response = await fetch('/api/selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selection,
          contactInfo: {
            name: bookingData.name,
            phone: bookingData.phone,
            email: bookingData.email,
          },
          bookingInfo: {
            date: bookingData.selectedDate,
            time: bookingData.selectedTime,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local selection with booking ID and saved data
        updateSelection({
          bookingId: result.data.id,
        });

        onNext();
      } else {
        alert('Ошибка при сохранении бронирования. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Ошибка при сохранении бронирования. Попробуйте еще раз.');
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Забронируйте просмотр участка
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Выберите удобное время для посещения и знакомства с вашим будущим участком.
          Наш специалист покажет вам все преимущества выбранного места.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Ваши контактные данные
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Имя <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Введите ваше полное имя"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Телефон <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="+380(99) 123-45-67"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="your.email@example.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Выберите дату и время
            </h3>
          </div>

          {/* Date Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Предпочтительная дата <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {dates.map((date) => {
                const dateObj = new Date(date);
                const dayName = dateObj.toLocaleDateString('ru-RU', { weekday: 'short' });
                const dayNumber = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('ru-RU', { month: 'short' });
                const isSelected = bookingData.selectedDate === date;
                const isToday = dateObj.toDateString() === today.toDateString();

                return (
                  <button
                    key={date}
                    onClick={() => setBookingData(prev => ({ ...prev, selectedDate: date }))}
                    className={`
                      relative p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200
                      ${isSelected
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className={`text-xs ${isSelected ? 'text-green-600' : 'text-gray-500'} font-semibold`}>
                      {dayName}
                    </div>
                    <div className={`text-lg font-bold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                      {dayNumber}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                      {monthName}
                    </div>
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Удобное время <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map((time) => {
                const isSelected = bookingData.selectedTime === time;

                return (
                  <button
                    key={time}
                    onClick={() => setBookingData(prev => ({ ...prev, selectedTime: time }))}
                    className={`
                      p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                      ${isSelected
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {(bookingData.selectedDate && bookingData.selectedTime) && (
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-green-900 mb-2">
                Выбранное время просмотра:
              </h4>
              <p className="text-green-800 font-medium">
                {new Date(bookingData.selectedDate).toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} в {bookingData.selectedTime}
              </p>
              <p className="text-sm text-green-700 mt-1">
                📍 Просмотр займет около 1 часа. Мы свяжемся с вами для подтверждения.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleBooking}
          disabled={!bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.selectedDate || !bookingData.selectedTime}
          className={`
            inline-flex items-center px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform
            ${bookingData.name && bookingData.phone && bookingData.email && bookingData.selectedDate && bookingData.selectedTime
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Забронировать просмотр
        </button>

        {!bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.selectedDate || !bookingData.selectedTime ? (
          <p className="text-sm text-gray-500 mt-3">
            ⚠️ Пожалуйста, заполните все обязательные поля для бронирования
          </p>
        ) : (
          <p className="text-sm text-green-600 mt-3 font-medium">
            ✓ Все данные заполнены! Можно переходить к бронированию
          </p>
        )}
      </div>

      {/* Information Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-blue-900 mb-2">
              Информация о бронировании
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• После бронирования мы свяжемся с вами в течение 30 минут</p>
              <p>• Просмотр проводится в удобное для вас время</p>
              <p>• Специалист покажет участок и ответит на все вопросы</p>
              <p>• Бронирование бесплатное и ни к чему не обязывает</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
