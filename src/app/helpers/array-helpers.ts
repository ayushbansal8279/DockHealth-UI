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

export const mergeArr = <T extends Record<string, any>>(
  arr1: T[],
  arr2: T[],
  idField: string,
): T[] => {
  const hashMap: { [key: string]: T } = {};

  arr1?.forEach((obj) => {
    hashMap[obj[idField]] = obj;
  });
  arr2?.forEach((obj) => {
    hashMap[obj[idField]] = {
      ...(hashMap[obj[idField]] ?? {}),
      ...obj,
    };
  });

  return Object.values(hashMap);
};
