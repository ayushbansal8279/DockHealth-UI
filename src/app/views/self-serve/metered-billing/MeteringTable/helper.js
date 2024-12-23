export const formatKey = (key) => {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^[a-z]/, (match) => match.toUpperCase());
};
