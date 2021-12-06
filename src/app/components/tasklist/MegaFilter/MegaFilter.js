/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import FilterTable from 'components/filter/FilterTable/FilterTable';
import { MegaFilterNoResultsLabel } from './styled';

const MegaFilter = ({
  children,
  filters,
  selectedFilters,
  onSelectFilters,
  activeItemsAmount,
  tasksAndSubTasksCount,
  isFetching,
  onOpen,
}) => {
  const [isOpen, openPopover] = useState(false);
  const [searchedFilterQuery, setSearchedFilterQuery] = useState('');
  const megaFilterButtonReference = useRef(null);

  const isFilterApplied = useSelector(hasFiltersAppliedSelector);

  const clearFilters = () => {
    onSelectFilters(null);
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (isOpen) onOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {children || (
        <FilterButton
          ref={megaFilterButtonReference}
          active={isFilterApplied}
          onClick={() => openPopover(!isOpen)}
          onClear={clearFilters}
        />
      )}
      <FilterPopover
        anchorEl={megaFilterButtonReference.current}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <>
          <FilterHeader
            title="Filter active tasks"
            filterActive={isFilterApplied}
            filteredItemsCount={tasksAndSubTasksCount}
            allItemsCount={activeItemsAmount}
            searchValue={searchedFilterQuery}
            onSearchValueChange={setSearchedFilterQuery}
            onClear={clearFilters}
          />
          {isFilterApplied && tasksAndSubTasksCount === 0 && !isFetching && (
            <MegaFilterNoResultsLabel>
              There are no results for your filter criteria.
            </MegaFilterNoResultsLabel>
          )}
          <Box p={2} />
          <FilterTable
            isLoading={isFetching}
            searchValue={searchedFilterQuery}
            filters={filters}
            selectedFilters={selectedFilters}
            onSelectedFiltersChange={onSelectFilters}
          />
        </>
      </FilterPopover>
    </>
  );
};

export default MegaFilter;
