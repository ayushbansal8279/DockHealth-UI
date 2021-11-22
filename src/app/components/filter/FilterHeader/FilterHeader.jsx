import React from 'react';
import { Box } from '@material-ui/core';
import FilterSearch from 'components/filter/FilterSearch/FilterSearch';
import { Container, Title, ClearButton } from './styled';

const FilterHeader = props => {
  const {
    title,
    filterActive,
    filteredItemsCount,
    allItemsCount,
    searchValue,
    onSearchValueChange,
    onClear,
  } = props;
  return (
    <Container>
      <Box display="flex" flex={1}>
        <Title>
          <b>{title}</b>{' '}
          {Number.isInteger(filteredItemsCount) &&
            Number.isInteger(allItemsCount) &&
            filteredItemsCount < allItemsCount && (
              <>
                showing {filteredItemsCount} of {allItemsCount} items
              </>
            )}
          {Number.isInteger(allItemsCount) &&
            (filteredItemsCount === undefined ||
              filteredItemsCount === allItemsCount) && (
              <>showing {allItemsCount} items</>
            )}
        </Title>
        {filterActive && (
          <ClearButton type="button" onClick={onClear}>
            Clear
          </ClearButton>
        )}
      </Box>
      <FilterSearch value={searchValue} onValueChange={onSearchValueChange} />
    </Container>
  );
};

export default FilterHeader;
