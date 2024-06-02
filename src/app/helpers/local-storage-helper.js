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
