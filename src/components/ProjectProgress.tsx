import React from 'react';

interface ProjectProgressProps {
    progress: {
        steps: {
            key: string;
            label: string;
            completed: boolean;
        }[];
        percent: number;
    } | undefined;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ progress }) => {
    if (!progress) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Прогресс проекта</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                    className="bg-emerald-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percent}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Выполнено на {progress.percent}%</span>
            </div>
            <div className="mt-4 space-y-2">
                {progress.steps.map((step) => (
                    <div key={step.key} className={`flex items-center ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${step.completed ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                            {step.completed && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span>{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectProgress;
