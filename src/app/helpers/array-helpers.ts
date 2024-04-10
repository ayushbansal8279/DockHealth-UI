export const addArr = <T extends Record<string, any>>(
  arr: T[],
  arrToAdd: T[],
  idField: string,
): T[] => {
  const arrSum = [...arr, ...arrToAdd];
  const res: T[] = [];
  const fieldHash: { [key: string]: boolean } = {};

  arrSum.forEach((item) => {
    if (fieldHash[item[idField]]) {
      return;
    }

    fieldHash[item[idField]] = true;
    res.push(item);
  });

  return res;
};

export const removeArr = <T extends Record<string, any>>(
  arr: T[],
  arrToRemove: T[],
  idField: string,
): T[] => {
  const fieldsSet = new Set(arr.map((item) => item[idField]));
  arrToRemove.forEach((item) => {
    fieldsSet.delete(item[idField]);
  });

  return arr.filter((item) => fieldsSet.has(item[idField]));
};
