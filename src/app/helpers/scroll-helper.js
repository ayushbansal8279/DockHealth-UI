export const isOutsideScrollViewAtTheTop = (containerElement, itemElement) => {
  const { offsetTop: itemOffsetTop } = itemElement;
  const { scrollTop: containerScrollTop } = containerElement;

  return itemOffsetTop < containerScrollTop;
};

export const isOutsideScrollViewAtTheBottom = (
  containerElement,
  itemElement,
) => {
  const { offsetTop: itemOffsetTop, offsetHeight: itemHeight } = itemElement;
  const { scrollTop: containerScrollTop, offsetHeight: containerHeight } =
    containerElement;

  return itemOffsetTop + itemHeight > containerScrollTop + containerHeight;
};

export const isOutsideScrollView = (containerElement, itemElement) =>
  isOutsideScrollViewAtTheTop(containerElement, itemElement) ||
  isOutsideScrollViewAtTheBottom(containerElement, itemElement);

export default isOutsideScrollView;
