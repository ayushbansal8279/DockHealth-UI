import { boolean } from 'yup';

export interface IDashboardTaskViewFilter {
  workflowHeaders: boolean;
}

export const dashboardTaskViewFilterOptions = [
  {
    name: 'workflowHeaders',
    label: 'Workflow Headers',
  },
] as const;
