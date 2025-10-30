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
  cleanedSelectedFilters,
};
