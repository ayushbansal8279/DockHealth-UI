import React from 'react';
import { Box } from '@material-ui/core';
import FilterSearch from 'components/filter/FilterSearch/FilterSearch';
import isEmpty from 'ramda/src/isEmpty';
import { Container, Title, HeaderButton } from './styled';

const FilterHeader = props => {
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
      <Box display="flex" flex={1} alignItems="center">
        <Title>
          <b>{title}</b>{' '}
          {/* {Number.isInteger(filteredItemsCount) &&
            Number.isInteger(allItemsCount) &&
            filteredItemsCount < allItemsCount && (
              <>
                showing {filteredItemsCount} of {allItemsCount} items
              </>
            )} */}
          {/* {Number.isInteger(allItemsCount) &&
            (filteredItemsCount === undefined ||
              filteredItemsCount === allItemsCount) && (
              <>showing {allItemsCount} items</>
            )} */}
        </Title>
        {filterActive && (
          <HeaderButton type="button" onClick={onClear}>
            Clear
          </HeaderButton>
        )}
        {onSave &&
          selectedFilters &&
          !isEmpty(selectedFilters) &&
          selectedQuickFilter &&
          editModeEnabled && (
            <HeaderButton type="button" onClick={onSave}>
              Save
            </HeaderButton>
          )}
        {onSaveAsNew && selectedFilters && !isEmpty(selectedFilters) && (
          <HeaderButton type="button" onClick={onSaveAsNew}>
            {selectedQuickFilter
              ? 'Save as new Quick Filter'
              : 'Add to saved filters'}
          </HeaderButton>
        )}
      </Box>
      <FilterSearch value={searchValue} onValueChange={onSearchValueChange} />
    </Container>
  );
};

export default FilterHeader;
