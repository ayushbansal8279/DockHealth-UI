const getItem = key => {
  try {
    const item = sessionStorage[key];

    if (item) return JSON.parse(item);

    return null;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

const setItem = (key, item) => {
  sessionStorage[key] = JSON.stringify(item);
};

export default {
  getItem,
  setItem,
};
