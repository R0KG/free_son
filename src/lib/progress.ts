import { CalculationInput, ProgressState, Project } from '@/types';

export function computeProgress(project: Project): ProgressState {
  const selectionDone = Boolean(project.selection?.houseProjectId || project.selection?.plotId);

  const params = project.calculationInput as CalculationInput | undefined;
  const parametersDone = Boolean(
    params && params.area && params.floors && params.wallMaterial && params.foundationType && params.finishLevel
  );

  const summaryDone = Boolean(project.calculationResult && project.calculationResult.totalPrice > 0);
  const contactsDone = Boolean(project.contact?.email || project.contact?.phone);

  const steps: ProgressState['steps'] = [
    { key: 'selection', label: 'Выбор проекта/участка', completed: selectionDone },
    { key: 'parameters', label: 'Параметры и опции', completed: parametersDone },
    { key: 'summary', label: 'Итоговый расчёт', completed: summaryDone },
    { key: 'contacts', label: 'Контакты', completed: contactsDone },
  ];

  const doneCount = steps.filter(s => s.completed).length;
  const percent = Math.round((doneCount / steps.length) * 100);

  return { steps, percent };
}


