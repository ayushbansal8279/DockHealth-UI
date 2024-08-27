import { DEFAULT_DASHBOARD_TASK_VIEW_FILTER } from '../types/taskViewFilter';

const getItem = (key) => {
  try {
    const item = localStorage[key];

    if (item) return JSON.parse(item);

    return null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const setItem = (key, item) => {
  localStorage[key] = JSON.stringify(item);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

export default {
  getItem,
  setItem,
  removeItem,
};

export const dashboardTaskViewFilterKey = (orgIdentifier) =>
  `dashboardTaskViewFilter_orgIdentifier:${orgIdentifier}`;

export const getDashboardTaskViewFilter = (orgIdentifier) => {
  const key = dashboardTaskViewFilterKey(orgIdentifier);
  return getItem(key) ?? DEFAULT_DASHBOARD_TASK_VIEW_FILTER;
};

export const setDashboardTaskViewFilter = (orgIdentifier, taskViewFilter) => {
  const key = dashboardTaskViewFilterKey(orgIdentifier);
  setItem(key, taskViewFilter);
};
