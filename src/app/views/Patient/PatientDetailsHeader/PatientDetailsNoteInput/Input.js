import React, { useEffect, useRef, useCallback } from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';

import { StyledInput } from './styled';

const Input = ({ onBlur, onChange, onEnter, placeholder, width, value }) => {
  const wrapperReference = useRef(null);

  const handleClickOutside = useCallback(
    event => {
      if (
        wrapperReference.current &&
        !wrapperReference.current.contains(event.target)
      ) {
        onBlur();
      }
    },
    [onBlur],
  );

  useEffect(() => {
    if (wrapperReference?.current) {
      wrapperReference.current.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperReference, handleClickOutside]);

  return (
    <MontserratTypography>
      <StyledInput
        onBlur={onBlur}
        onChange={({ target }) => onChange(target?.value)}
        onKeyDown={event => event.keyCode === 13 && onEnter()}
        placeholder={placeholder}
        width={width}
        value={value}
        ref={wrapperReference}
        required
      />
    </MontserratTypography>
  );
};

export default Input;
