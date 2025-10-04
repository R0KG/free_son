import { NextResponse } from 'next/server';
import { HouseProject } from '@/types';

const projects: HouseProject[] = [
    {
        id: 'project-1',
        name: 'Современный лофт',
        description: 'Стильный и современный лофт с открытой планировкой.',
        area: 120,
        floors: 2,
        price: 150000,
        image: '/project-1.jpg',
        bedrooms: 2,
        features: ['Открытая концепция', 'Терраса на крыше', 'Умный дом'],
    },
    {
        id: 'project-2',
        name: 'Семейный дом',
        description: 'Просторный и комфортный дом для всей семьи.',
        area: 200,
        floors: 2,
        price: 250000,
        image: '/project-2.jpg',
        bedrooms: 4,
        features: ['Большой двор', 'Гараж на две машины', 'Современная кухня'],
    },
    {
        id: 'project-3',
        name: 'Уютный коттедж',
        description: 'Очаровательный коттедж, идеальный для отдыха на выходных.',
        area: 80,
        floors: 1,
        price: 90000,
        image: '/project-3.jpg',
        bedrooms: 1,
        features: ['Камин', 'Сад', 'Передняя веранда'],
    },
];

export async function GET() {
    return NextResponse.json(projects);
}


