/* eslint-disable import/prefer-default-export */
export const getUniqueQuickFilterLabelName = (
  list,
  prefix = 'Custom Filter',
  startCounter = 1,
) => {
  const name = `${prefix} ${startCounter}`;
  let isExistingSameName = false;
  list.forEach(element => {
    if (element.displayValue === name) {
      isExistingSameName = true;
    }
  });
  return isExistingSameName
    ? getUniqueQuickFilterLabelName(list, prefix, startCounter + 1)
    : name;
};
