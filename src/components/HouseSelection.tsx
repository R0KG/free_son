'use client';

import { useState } from 'react';
import { useSelection } from '@/context/SelectionContext';
import { HouseProject } from '@/types';

interface HouseSelectionProps {
  onNext: () => void;
}

export default function HouseSelection({ onNext }: HouseSelectionProps) {
  const { houseProjects, selection, updateSelection } = useSelection();
  const [selectedProject, setSelectedProject] = useState<HouseProject | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const handleProjectSelect = (project: HouseProject) => {
    setSelectedProject(project);
    updateSelection({ houseProjectId: project.id });
  };

  const handleNext = () => {
    if (selection.houseProjectId) {
      onNext();
    }
  };

  const getImageUrl = (projectName: string) => {
    // In a real app, these would be actual image URLs
    const imageMap: Record<string, string> = {
      'Современный лофт': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop&auto=format',
      'Семейный дом': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop&auto=format',
      'Уютный коттедж': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=250&fit=crop&auto=format',
    };
    return imageMap[projectName] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop&auto=format';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Выберите дом своей мечты
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Мы предлагаем тщательно разработанные проекты домов, сочетающие современный дизайн,
          функциональность и комфорт. Каждый проект создан с учетом потребностей современной семьи.
        </p>
      </div>

      {/* House Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {houseProjects.map((project) => (
          <div
            key={project.id}
            className={`
              group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
              ${selection.houseProjectId === project.id
                ? 'ring-2 ring-green-500 shadow-green-100 shadow-xl transform scale-[1.02]'
                : 'hover:shadow-2xl hover:scale-[1.01]'
              }
            `}
            onClick={() => handleProjectSelect(project)}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Project Image */}
            <div className="relative h-64 overflow-hidden group/image">
              <img
                src={getImageUrl(project.name)}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Subtle hover overlay - much lighter */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Enhanced selection indicator */}
              {selection.houseProjectId === project.id && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-3 shadow-xl animate-pulse">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Enhanced hover badge */}
              {hoveredProject === project.id && selection.houseProjectId !== project.id && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-xl text-sm font-semibold shadow-lg border border-white/20">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    
                  </div>
                </div>
              )}

              {/* Project type badge - always visible */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-xl text-sm font-semibold shadow-lg border border-white/20">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {project.name.includes('Современный') && 'Современный'}
                  {project.name.includes('Семейный') && 'Классический'}
                  {project.name.includes('Уютный') && 'Минимализм'}
                </div>
              </div>

              {/* Additional details overlay on hover */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/20 shadow-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{project.area} м²</div>
                    <div className="text-xs text-gray-600">Площадь</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{project.bedrooms}</div>
                    <div className="text-xs text-gray-600">Спален</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.features?.slice(0, 2).map((feature, index) => (
                    <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 group/details">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                  {project.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors duration-200 group-hover/spec">
                  <div className="text-2xl font-bold text-green-600 mb-1 group-hover/spec:text-green-700">
                    {project.area}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Общая площадь</div>
                  <div className="text-sm text-gray-600 mt-1">кв. метров</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group-hover/spec">
                  <div className="text-2xl font-bold text-blue-600 mb-1 group-hover/spec:text-blue-700">
                    {project.bedrooms}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Спальни</div>
                  <div className="text-sm text-gray-600 mt-1">комнаты</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">
                  Ключевые особенности
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-green-100 hover:to-green-200 hover:text-green-800 transition-all duration-200 group/feature"
                    >
                      <svg className="w-3 h-3 mr-1 text-green-500 group-hover/feature:text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Section */}
              <div className="border-t pt-4 group/price">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600 group-hover/price:text-green-700 transition-colors duration-200">
                      ${project.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                      Цена строительства
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-semibold">от</div>
                    <div className="text-xs text-gray-400">
                      ${Math.round(project.price / project.area).toLocaleString()}/m²
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-100 group-hover/price:from-green-100 group-hover/price:to-blue-100 transition-colors duration-200">
                  <div className="flex items-center text-xs text-green-700">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    💡 В стоимость включены все материалы и работы под ключ
                  </div>
                </div>
              </div>

              {/* Hover hint */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/20 shadow-lg pointer-events-none">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-800 font-medium">Наведите курсор для деталей</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.area} м² • {project.bedrooms} спален
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12 border border-green-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ✨ Вы выбрали: {selectedProject.name}
              </h3>
              <p className="text-gray-600">
                Отличный выбор! Этот проект идеально подходит для комфортной жизни.
              </p>
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Рекомендуем
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{selectedProject.area}</div>
                <div className="text-sm text-gray-500">Общая площадь</div>
                <div className="text-xs text-gray-400 mt-1">кв. метров</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{selectedProject.bedrooms}</div>
                <div className="text-sm text-gray-500">Спальни</div>
                <div className="text-xs text-gray-400 mt-1">комнаты</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round(selectedProject.price / selectedProject.area)}
                </div>
                <div className="text-sm text-gray-500">Стоимость за м²</div>
                <div className="text-xs text-gray-400 mt-1">dollars</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Включено в стоимость:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Полный комплект проектной документации
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Фундамент и несущие конструкции
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Кровля и фасадные работы
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Полная внутренняя отделка
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Инженерные системы (электрика, сантехника, отопление)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Особенности проекта:
              </h4>
              <ul className="space-y-2">
                {selectedProject.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center mb-12">
        <button
          onClick={handleNext}
          disabled={!selection.houseProjectId}
          className={`
            inline-flex items-center px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300
            ${selection.houseProjectId
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Продолжить к бронированию
        </button>
        {!selection.houseProjectId && (
          <p className="text-sm text-gray-500 mt-2">
            Пожалуйста, выберите проект дома для продолжения
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
            Сравнение проектов
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Детальное сравнение всех доступных проектов домов
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Проект
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Площадь
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Спальни
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Стоимость
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Стоимость за м²
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Стиль
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {houseProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className={`
                    cursor-pointer transition-colors duration-200
                    ${selection.houseProjectId === project.id
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : 'hover:bg-gray-50'
                    }
                  `}
                  onClick={() => handleProjectSelect(project)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.features?.slice(0, 2).join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-bold text-gray-900">{project.area}</div>
                    <div className="text-xs text-gray-500">m²</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-bold text-gray-900">{project.bedrooms}</div>
                    <div className="text-xs text-gray-500">шт.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-bold text-green-600">{project.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">$</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {Math.round(project.price / project.area).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">$/m²</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`
                      inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${project.name.includes('Современный') ? 'bg-blue-100 text-blue-800' : ''}
                      ${project.name.includes('Семейный') ? 'bg-purple-100 text-purple-800' : ''}
                      ${project.name.includes('Уютный') ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {project.name.includes('Современный') && 'Современный'}
                      {project.name.includes('Семейный') && 'Классический'}
                      {project.name.includes('Уютный') && 'Минимализм'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
