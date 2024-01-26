import React from 'react';
import { Box } from '@mui/material';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import {
  BoxContainer,
  FilterButtonWrapper,
  FilterButtonLabel,
  FilterClearButtonWrapper,
  FilterClearButtonLabel,
  FilterRotatableChevronButtonWrapper,
  FilterRotatableChevronButtonLabel,
} from './styled';

const FilterButton = React.forwardRef(
  ({ active, onClick, onClear, isOpen, value, focused }, reference) => (
    <BoxContainer ref={reference} wide={value || focused}>
      <FilterButtonWrapper
        variant="text"
        onClick={onClick}
        size="large"
        active={+active}
        wide={value || focused}
      >
        {/* https://maximeblanc.fr/blog/how-to-fix-the-received-true-for-a-non-boolean-attribute-error */}
        <FilterListIcon fontSize="medium" />
        <FilterButtonLabel variant="body1" component="span" active={+active}>
          Filters
        </FilterButtonLabel>
        {/* <RotatableChevron rotated={active} color={palette.white} /> */}
      </FilterButtonWrapper>
      {active ? (
        <Box display="flex" width="35px" overflow="hidden">
          <FilterClearButtonWrapper
            variant="text"
            onClick={onClear}
            size="small"
            active={+active}
            wide={value || focused}
          >
            <FilterClearButtonLabel
              variant="body1"
              component="span"
              wide={value || focused}
            >
              <ClearIcon />
            </FilterClearButtonLabel>
          </FilterClearButtonWrapper>
        </Box>
      ) : (
        <Box display="flex" width="35px" overflow="hidden">
          <FilterRotatableChevronButtonWrapper
            variant="text"
            onClick={onClick}
            size="large"
            wide={value || focused}
          >
            <FilterRotatableChevronButtonLabel
              variant="body1"
              component="span"
              wide={value || focused}
            >
              <RotatableChevron rotated={isOpen} color={palette.white} />
            </FilterRotatableChevronButtonLabel>
          </FilterRotatableChevronButtonWrapper>
        </Box>
      )}
    </BoxContainer>
  ),
);

export default FilterButton;
