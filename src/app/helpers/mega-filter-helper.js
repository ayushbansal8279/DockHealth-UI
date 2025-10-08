export function getFiltersStorageKey(identifier, status) {
  return `filter-${identifier}-${status}`;
}

export function getQuickFilterStorageKey(identifier, status) {
  return `quickfilter-${identifier}-${status}`;
}

export function getSortStorageKey(identifier, status) {
  return `sort-${identifier}-${status}`;
}

export function getMultipleSelectedQuickFilterStorageKey(identifier, status) {
  return `multipleSelectedQuickFilters-${identifier}-${status}`;
}

export const getFiltersFromLocalStorage = (identifier, status) =>
  sessionStorage[getFiltersStorageKey(identifier, status)];

export const getQuickFilterFromLocalStorage = (identifier, status) =>
  sessionStorage[getQuickFilterStorageKey(identifier, status)];

export function cleanedSelectedFilters(filters) {
  if (filters === undefined) {
    return {};
  }
  const cleanedFilters = {};
  for (const key in filters) {
    if (key.trim() !== '') {
      cleanedFilters[key] = filters[key];
    }
  }
  return cleanedFilters;
}

export default {
  getFiltersStorageKey,
  getQuickFilterStorageKey,
  getSortStorageKey,
  getFiltersFromLocalStorage,
  getQuickFilterFromLocalStorage,
  cleanedSelectedFilters,
};
