export const getUniqueQuickFilterLabelName = (
  list,
  prefix = 'Custom Filter',
  startCounter = 1,
) => {
  const name = `${prefix} ${startCounter}`;
  let isExistingSameName = false;
  for (const element of list) {
    if (element.name === name) {
      isExistingSameName = true;
    }
  }
  return isExistingSameName
    ? getUniqueQuickFilterLabelName(list, prefix, startCounter + 1)
    : name;
};
