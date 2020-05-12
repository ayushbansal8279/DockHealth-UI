import React, { useEffect, useRef, useCallback } from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';

import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const Input = styled.input`
  background-color: white;
  border: 1px solid ${palette.coolGrey3};
  border-radius: 4px;
  font-weight: ${fontWeights.regularPlus};
  outline: none;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  text-transform: uppercase;
  width: ${props => props.width || '260px'};
`;

const GroupNameInput = ({
  onBlur,
  onChange,
  onEnter,
  placeholder,
  width,
  value,
}) => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperReference, handleClickOutside]);

  return (
    <MontserratTypography>
      <Input
        onBlur={onBlur}
        onChange={({ target }) => onChange(target?.value)}
        onKeyDown={event => event.keyCode === 13 && onEnter(event.target.value)}
        placeholder={placeholder}
        width={width}
        value={value}
        ref={wrapperReference}
        required
      />
    </MontserratTypography>
  );
};

export default GroupNameInput;
