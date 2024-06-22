import { boolean } from 'yup';

export interface IDashboardTaskViewFilter {
  includeWorkflows: boolean;
}

export const DEFAULT_DASHBOARD_TASK_VIEW_FILTER: IDashboardTaskViewFilter = {
  includeWorkflows: true,
};

export const dashboardTaskViewFilterOptions = [
  {
    name: 'includeWorkflows',
    label: 'Workflow Headers',
  },
] as const;
