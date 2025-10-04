'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSelection, Plot, HouseProject } from '@/types';

interface SelectionContextType {
  selection: UserSelection;
  updateSelection: (updates: Partial<UserSelection>) => void;
  resetSelection: () => void;
  plots: Plot[];
  houseProjects: HouseProject[];
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

interface SelectionProviderProps {
  children: React.ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children }) => {
  const [selection, setSelection] = useState<UserSelection>({
    plotId: null,
    constructionFormat: null,
    houseProjectId: null,
    bookingId: null,
  });

  // Mock data for plots - in real app, this would come from API
  const [plots] = useState<Plot[]>([
    {
      id: 'plot-1',
      name: 'Участок А1',
      area: 1200,
      price: 25000,
      coordinates: { x: 50.4501, y: 30.5234, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт'],
      description: 'Прекрасный участок в тихом районе с развитой инфраструктурой'
    },
    {
      id: 'plot-2',
      name: 'Участок А2',
      area: 1500,
      price: 32000,
      coordinates: { x: 50.4651, y: 30.5384, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт', 'Детская площадка'],
      description: 'Большой участок с видом на парк, идеален для семьи'
    },
    {
      id: 'plot-3',
      name: 'Участок А3',
      area: 1000,
      price: 21000,
      coordinates: { x: 50.4351, y: 30.5084, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Асфальт'],
      description: 'Компактный участок в центре поселка'
    },
    {
      id: 'plot-4',
      name: 'Участок B1',
      area: 1300,
      price: 28000,
      coordinates: { x: 50.4614, y: 30.4897, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт', 'Лес рядом'],
      description: 'Участок у леса с чистым воздухом'
    },
    {
      id: 'plot-5',
      name: 'Участок B2',
      area: 1100,
      price: 24000,
      coordinates: { x: 50.4426, y: 30.5089, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт', 'Рядом озеро'],
      description: 'Живописный участок недалеко от озера'
    },
    {
      id: 'plot-6',
      name: 'Участок C1',
      area: 1400,
      price: 31000,
      coordinates: { x: 50.4572, y: 30.5248, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт'],
      description: 'Забронирован для клиента, документы в обработке'
    },
    {
      id: 'plot-7',
      name: 'Участок C2',
      area: 1600,
      price: 36000,
      coordinates: { x: 50.4641, y: 30.5153, width: 0, height: 0 },
      available: true,
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт', 'Сад'],
      description: 'Забронирован, ожидает подписания договора'
    },
    // Reserved plots
    {
      id: 'plot-8',
      name: 'Участок D1',
      area: 1250,
      price: 2700000,
      coordinates: { x: 50.4503, y: 30.5201, width: 0, height: 0 },
      available: false, // Reserved
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт'],
      description: 'Забронирован для клиента, документы в обработке'
    },
    {
      id: 'plot-9',
      name: 'Участок D2',
      area: 1350,
      price: 29500,
      coordinates: { x: 50.4668, y: 30.4987, width: 0, height: 0 },
      available: false, // Reserved
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт', 'Сад'],
      description: 'Забронирован, ожидает подписания договора'
    },
    // Sold plots
    {
      id: 'plot-10',
      name: 'Участок E1',
      area: 1150,
      price: 26000,
      coordinates: { x: 50.4529, y: 30.5114, width: 0, height: 0 },
      available: false, // Sold
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт'],
      description: 'Продан, строительство начато'
    },
    {
      id: 'plot-11',
      name: 'Участок E2',
      area: 1450,
      price: 33000,
      coordinates: { x: 50.4505, y: 30.5198, width: 0, height: 0 },
      available: false, // Sold
      features: ['Электричество', 'Водопровод', 'Газ', 'Асфальт', 'Бассейн'],
      description: 'Продан, дом уже построен'
    },
    {
      id: 'plot-12',
      name: 'Участок F1',
      area: 1050,
      price: 23000,
      coordinates: { x: 50.4515, y: 30.5124, width: 0, height: 0 },
      available: false, // Sold
      features: ['Электричество', 'Водопровод', 'Асфальт'],
      description: 'Продан, участок благоустроен'
    },
  ]);

  const [houseProjects, setHouseProjects] = useState<HouseProject[]>([]);

  useEffect(() => {
    const fetchHouseProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch house projects');
        }
        const data = await response.json();
        setHouseProjects(data);
      } catch (error) {
        console.error(error);
        // Handle error state in a real app
      }
    };

    fetchHouseProjects();
  }, []);

  const updateSelection = (updates: Partial<UserSelection>) => {
    setSelection(prev => ({ ...prev, ...updates }));
  };

  const resetSelection = () => {
    setSelection({
      plotId: null,
      constructionFormat: null,
      houseProjectId: null,
      bookingId: null,
    });
  };

  return (
    <SelectionContext.Provider value={{
      selection,
      updateSelection,
      resetSelection,
      plots,
      houseProjects,
    }}>
      {children}
    </SelectionContext.Provider>
  );
};
