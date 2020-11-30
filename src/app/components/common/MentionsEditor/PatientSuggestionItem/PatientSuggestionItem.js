import PatientSelectItem from 'components/patients/PatientSelectItem/PatientSelectItem';
import {
  isOutsideScrollViewAtTheBottom,
  isOutsideScrollViewAtTheTop,
} from 'helpers/scroll-helper';
import React, { useEffect, useRef } from 'react';

const PatientSuggestionItem = ({
  mention,
  searchValue,
  isFocused,
  ...parentProps
}) => {
  const suggestionItemReference = useRef(null);

  const handleScroll = () => {
    const itemElement = suggestionItemReference.current.parentElement;
    const containerElement =
      suggestionItemReference.current.parentElement.parentElement;
    const { offsetTop: itemOffsetTop, offsetHeight: itemHeight } = itemElement;
    const { offsetHeight: containerHeight } = containerElement;

    if (isOutsideScrollViewAtTheBottom(containerElement, itemElement)) {
      containerElement.scrollTop = itemOffsetTop - containerHeight + itemHeight;
    } else if (isOutsideScrollViewAtTheTop(containerElement, itemElement)) {
      containerElement.scrollTop = itemOffsetTop;
    }
  };

  useEffect(() => {
    if (suggestionItemReference.current && isFocused) {
      handleScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <PatientSelectItem
      ref={suggestionItemReference}
      patient={mention}
      searchValue={searchValue}
      isFocused={isFocused}
      {...parentProps}
    />
  );
};

export default PatientSuggestionItem;
