import React from 'react';
import { Box } from '@material-ui/core';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
import {
  FilterButtonWrapper,
  FilterButtonLabel,
  FilterClearButtonWrapper,
  FilterClearButtonLabel,
} from './styled';

const FilterButton = React.forwardRef(
  ({ active, onClick, onClear }, reference) => (
    <Box
      ref={reference}
      display="flex"
      width="fit-content"
      borderRadius={4}
      overflow="hidden"
    >
      <FilterButtonWrapper
        variant="text"
        onClick={onClick}
        size="small"
        active={+active}
      >
        {/* https://maximeblanc.fr/blog/how-to-fix-the-received-true-for-a-non-boolean-attribute-error */}
        <FilterButtonLabel variant="body1" component="span" active={+active}>
          FILTER
        </FilterButtonLabel>
        <RotatableChevron
          rotated={active}
          color={active ? palette.white : palette.brightBlue}
        />
      </FilterButtonWrapper>
      {active && (
        <FilterClearButtonWrapper variant="text" onClick={onClear} size="small">
          <FilterClearButtonLabel variant="body1" component="span">
            CLEAR
          </FilterClearButtonLabel>
        </FilterClearButtonWrapper>
      )}
    </Box>
  ),
);

export default FilterButton;
