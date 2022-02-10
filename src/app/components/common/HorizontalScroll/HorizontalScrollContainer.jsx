import React, { useRef, useEffect, createContext, useState } from 'react';
import debounce from 'lodash.debounce';
import { subMenuKeySelector } from 'selectors/template-selectors';
import { useSelector } from 'react-redux';
import {
  HorizontalScrollOuterWrapper,
  HorizontalScrollInnerWrapper,
} from './styled';

export const Context = createContext(0);

const HorizontalScrollContainer = ({ children }) => {
  const reference = useRef(null);
  const [elementWidth, setElementWidth] = useState(0);
  const openedSubMenuKey = useSelector(subMenuKeySelector);

  const handleResizeCallback = debounce(() => {
    if (
      reference?.current?.offsetWidth &&
      reference?.current?.offsetWidth !== elementWidth
    )
      setElementWidth(reference?.current?.offsetWidth);
  }, 300);

  useEffect(() => {
    handleResizeCallback();
  }, [handleResizeCallback, openedSubMenuKey]);

  useEffect(() => {
    window.addEventListener('resize', handleResizeCallback);

    return () => {
      window.removeEventListener('resize', handleResizeCallback);
    };
  }, [handleResizeCallback]);

  return (
    <Context.Provider value={elementWidth}>
      <HorizontalScrollOuterWrapper ref={reference}>
        <HorizontalScrollInnerWrapper>{children}</HorizontalScrollInnerWrapper>
      </HorizontalScrollOuterWrapper>
    </Context.Provider>
  );
};

export default HorizontalScrollContainer;
