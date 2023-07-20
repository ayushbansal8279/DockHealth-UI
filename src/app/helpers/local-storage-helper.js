const getItem = (key) => {
  try {
    const item = localStorage[key];

    if (item) return JSON.parse(item);

    return;
  } catch {
    localStorage.removeItem(key);
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
