import React from 'react';
import { Box } from '@mui/material';
import FilterSearch from 'components/filter/FilterSearch/FilterSearch';
import isEmpty from 'ramda/src/isEmpty';
import { Container, Title, HeaderButton } from './styled';

const FilterHeader = (props) => {
  const {
    title,
    filterActive,
    // filteredItemsCount,
    // allItemsCount,
    searchValue,
    onSearchValueChange,
    onClear,
    onSave,
    onSaveAsNew,
    editModeEnabled,
    selectedQuickFilter,
    selectedFilters,
  } = props;

  return (
    <Container>
      <div>Quick Filters</div>
      <div>Quick Filters Here</div>
    </Container>
  );
};

export default FilterHeader;
