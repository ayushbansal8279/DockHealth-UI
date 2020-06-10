export const getFiltersFromLocalStorage = (identifier, status) =>
  sessionStorage[`filter-${identifier}-${status}`]
    ? JSON.parse(sessionStorage[`filter-${identifier}-${status}`])
    : null;

export default {
  getFiltersFromLocalStorage,
};
