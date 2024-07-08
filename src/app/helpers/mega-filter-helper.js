export function getFiltersStorageKey(identifier, status) {
  return `filter-${identifier}-${status}`;
}

export function getQuickFilterStorageKey(identifier, status) {
  return `quickfilter-${identifier}-${status}`;
}

export function getMultipleSelectedQuickFilterStorageKey(identifier, status) {
  return `multipleSelectedQuickFilters-${identifier}-${status}`;
}

export const getFiltersFromLocalStorage = (identifier, status) =>
  sessionStorage[getFiltersStorageKey(identifier, status)];

export const getQuickFilterFromLocalStorage = (identifier, status) =>
  sessionStorage[getQuickFilterStorageKey(identifier, status)];

export default {
  getFiltersStorageKey,
  getQuickFilterStorageKey,
  getFiltersFromLocalStorage,
  getQuickFilterFromLocalStorage,
};
