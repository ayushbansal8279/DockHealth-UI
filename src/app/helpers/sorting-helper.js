/* eslint-disable no-plusplus */
export function arrayMove(array, oldIndex, newIndex) {
  const arrayCopy = [...array];
  if (newIndex >= arrayCopy.length) {
    let k = newIndex - arrayCopy.length + 1;
    while (k--) {
      arrayCopy.push(undefined);
    }
  }
  arrayCopy.splice(newIndex, 0, arrayCopy.splice(oldIndex, 1)[0]);
  return arrayCopy;
}

export default {
  arrayMove,
};
