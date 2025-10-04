'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { debounce } from 'lodash';
import { CalculationInputSchema, zCalculationInput } from '@/types/schemas';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const translationMap: { [key: string]: string } = {
    'heating_radiators': 'Радиаторы отопления',
    'warm_floor': 'Теплый пол',
    'ventilation': 'Вентиляция',
    'water_supply': 'Водоснабжение',
    'septic': 'Септик',
    'electricity': 'Электричество',
    'terrace': 'Терраса',
    'fireplace': 'Камин',
    'panoramic_windows': 'Панорамные окна',
    'garage': 'Гараж',
};

// ... (Add SVG icon components here if needed, or import them)

interface CalculatorFormProps {
  initialData?: Partial<CalculationInputSchema>;
  onCalculate: (data: CalculationInputSchema) => void;
  projectId: string;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ initialData, onCalculate, projectId }) => {
  const [formData, setFormData] = useState<Partial<CalculationInputSchema>>(initialData || {
    area: 100,
    floors: 1,
    wallMaterial: 'wood',
    foundationType: 'slab',
    finishLevel: 'shell',
    engineeringOptions: [],
    extras: [],
  });
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const debouncedCalculate = useCallback(
    debounce(async (data, projectId) => {
      const parsed = zCalculationInput.safeParse(data);
      if (parsed.success) {
        setErrors(null);
        try {
          const response = await fetch('/api/calc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: parsed.data, projectId }),
          });
          const result = await response.json();
          if (result.success) {
            onCalculate(result.data.calculationResult);
          } else {
            console.error("API Error:", result.error);
          }
        } catch (error) {
          console.error("Fetch Error:", error);
        }
      } else {
        setErrors(parsed.error);
      }
    }, 500),
    [onCalculate]
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    debouncedCalculate(formData, projectId);
    return () => debouncedCalculate.cancel();
  }, [formData, projectId, debouncedCalculate]);

  const handleValueChange = (name: keyof CalculationInputSchema, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: 'engineeringOptions' | 'extras', value: string, checked: boolean) => {
    const currentValues = formData[name] as string[] || [];
    const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
    handleValueChange(name, newValues);
  };


  return (
    <Card>
      <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Основные параметры</h3>
            <div className="space-y-6">
                <Input
                    label="Площадь (м²)"
                    type="number"
                    name="area"
                    value={formData.area || ''}
                    onChange={(e) => handleValueChange('area', Number(e.target.value))}
                />
                <CustomRadioGroup
                    label="Этажность"
                    name="floors"
                    value={formData.floors}
                    onChange={(val) => handleValueChange('floors', val)}
                    options={[
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                    ]}
                />
            </div>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Конструкция</h3>
            <div className="space-y-6">
                <CustomRadioGroup
                    label="Материал стен"
                    name="wallMaterial"
                    value={formData.wallMaterial}
                    onChange={(val) => handleValueChange('wallMaterial', val)}
                    options={[
                        { value: 'wood', label: 'Дерево' },
                        { value: 'brick', label: 'Кирпич' },
                        { value: 'aerated_concrete', label: 'Газобетон' },
                    ]}
                />
                <CustomRadioGroup
                    label="Тип фундамента"
                    name="foundationType"
                    value={formData.foundationType}
                    onChange={(val) => handleValueChange('foundationType', val)}
                    options={[
                        { value: 'slab', label: 'Плитный' },
                        { value: 'strip', label: 'Ленточный' },
                        { value: 'pile', label: 'Свайный' },
                    ]}
                />
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Отделка и опции</h3>
            <div className="space-y-6">
                 <CustomRadioGroup
                    label="Уровень отделки"
                    name="finishLevel"
                    value={formData.finishLevel}
                    onChange={(val) => handleValueChange('finishLevel', val)}
                    options={[
                        { value: 'shell', label: 'Черновая' },
                        { value: 'basic', label: 'Базовая' },
                        { value: 'turnkey', label: 'Под ключ' },
                    ]}
                />
                <CustomCheckboxGroup
                    label="Инженерные системы"
                    name="engineeringOptions"
                    values={formData.engineeringOptions || []}
                    onChange={handleCheckboxChange}
                    options={(zCalculationInput.shape.engineeringOptions._def as any).innerType.element.options.map((o: string) => ({value: o, label: translationMap[o] || o}))}
                />
                 <CustomCheckboxGroup
                    label="Дополнительные опции"
                    name="extras"
                    values={formData.extras || []}
                    onChange={handleCheckboxChange}
                    options={(zCalculationInput.shape.extras.unwrap().element as z.ZodEnum<any>).options.map((o: string) => ({value: o, label: translationMap[o] || o}))}
                />
            </div>
        </div>

        {errors && (
          <div className="text-red-500 text-sm">
            <ul>
              {errors.errors.map((err) => (
                <li key={err.path.join('.')}>{`${err.path.join('.')} - ${err.message}`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};


// Custom Radio Group Component
const CustomRadioGroup = ({ label, name, value, onChange, options }: {
    label: string;
    name: string;
    value: any;
    onChange: (value: any) => void;
    options: { value: any; label: string }[];
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                        value === option.value ? 'bg-white text-emerald-700 shadow' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

// Custom Checkbox Group Component
const CustomCheckboxGroup = ({ label, name, values, onChange, options }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {options.map((option: any) => (
                 <label key={option.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                        type="checkbox"
                        name={name}
                        value={option.value}
                        checked={values.includes(option.value)}
                        onChange={(e) => onChange(name, e.target.value, e.target.checked)}
                        className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);


export default CalculatorForm;
