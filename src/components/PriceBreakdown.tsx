import React from 'react';
import { CalculationResultSchema } from '@/types';

interface PriceBreakdownProps {
  result: CalculationResultSchema | null | undefined;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ result }) => {
  if (!result) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Детализация цены</h3>
            <div className="text-center py-8 text-gray-500">
                <p>Выберите параметры для расчета</p>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Детализация цены</h3>
      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Базовая стоимость</span>
            <span className="font-medium text-gray-900">${result.basePrice.toLocaleString()}</span>
        </div>
        {result.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">${item.amount.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 font-bold text-lg">
          <span className="text-gray-900">Итоговая стоимость</span>
          <span className="text-emerald-600">${result.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
