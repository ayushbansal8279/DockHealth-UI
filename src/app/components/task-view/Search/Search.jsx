import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import SearchClearIcon from 'img/search-clear.svg';
import SearchHeadsupIcon from 'img/search-headsup.svg';

import { StyledTextField, StyledAdornment, ClearButton } from './styled';

const Search = ({
  className,
  onChange,
  onFocus,
  onBlur,
  variant,
  autoFocus,
  fullWidth,
  noBackground,
  value,
  placeholder,
  ...otherInputProps
}) => {
  const searchReference = useRef(null);

  const onClearClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onChange({ target: { value: '' } });
    },
    [onChange],
  );

  return (
    <StyledTextField
      ref={searchReference}
      onChange={onChange}
      onFocus={() => {
        if (searchReference.current) {
          if (typeof onFocus === 'function') onFocus();
          searchReference.current.style.backgroundColor = 'white';
        }
      }}
      onBlur={() => {
        if (!searchReference.current.value) {
          searchReference.current.style.backgroundColor = null;
          if (typeof onBlur === 'function') onBlur();
        }
      }}
      placeholder={placeholder || 'Search'}
      classes={className}
      fullWidth={fullWidth}
      variant={variant}
      transparentbackground={!value && noBackground ? 'true' : 'false'}
      InputProps={{
        startAdornment: (
          <StyledAdornment position="start" disablePointerEvents>
            <img src={SearchHeadsupIcon} alt="Search icon" />
          </StyledAdornment>
        ),
        endAdornment: (
          <StyledAdornment
            position="end"
            disablePointerEvents={false}
            visible={Boolean(value)}
          >
            {value !== '' && (
              <ClearButton onClick={onClearClick}>
                <img alt="clear" src={SearchClearIcon} />
              </ClearButton>
            )}
          </StyledAdornment>
        ),
        'aria-label': 'Search',
        type: 'search',
        autoFocus,
        value,
        ...otherInputProps,
      }}
    />
  );
};

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
