/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import isEmpty from 'ramda/src/isEmpty';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import FilterTable from 'components/filter/FilterTable/FilterTable';
import CustomFilters from 'components/filter/CustomFilters/CustomFilters';
import { MegaFilterNoResultsLabel, MegaFilterContainer } from './styled';
import NewFilterContainer from '../../filter/NewFilterContainer/NewFilterContainer';

const MegaFilter = ({
  children,
  filters,
  selectedFilters,
  onSelectFilters,
  activeItemsAmount,
  tasksAndSubTasksCount,
  isFetching,
  onOpen,
  quickFiltersList,
  addQuickFilterOption,
  selectedQuickFilter,
  selectQuickFilter,
  onSaveClick,
  onSaveAsNewClick,
  onQuickFilterUpdate,
  wasChangedFilters,
  onQuickFilterCreate,
  onQuickFilterDelete,
  isDefaultDateFilterApplied = false,
  value,
  focused,
}) => {
  const [isOpen, openPopover] = useState(false);
  const [searchedFilterQuery, setSearchedFilterQuery] = useState('');
  const megaFilterButtonReference = useRef(null);
  const isFilterApplied = selectedFilters && !isEmpty(selectedFilters);
  const [menuOptions, setMenuOption] = useState([]);
  const [finalFilter, setFinalFilter] = useState({});
  const [assignedUser, setAssignedUser] = useState({});

  const clearFilters = () => {
    onSelectFilters(null);
    selectQuickFilter(null);
    setFinalFilter({});
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (isOpen) onOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <MegaFilterContainer isFilterApplied={isFilterApplied}>
      {children || (
        <FilterButton
          ref={megaFilterButtonReference}
          active={isFilterApplied}
          onClick={() => openPopover(!isOpen)}
          onClear={clearFilters}
          isOpen={isOpen}
          value={value}
          focused={focused}
        />
      )}
      <FilterPopover
        anchorEl={megaFilterButtonReference.current}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <>
          <FilterHeader
          // title="Filter tasks"
          // filterActive={isFilterApplied}
          // filteredItemsCount={tasksAndSubTasksCount}
          // allItemsCount={activeItemsAmount}
          // searchValue={searchedFilterQuery}
          // onSearchValueChange={setSearchedFilterQuery}
          // onClear={clearFilters}
          // onSave={onSaveClick}
          // onSaveAsNew={onSaveAsNewClick}
          // selectedQuickFilter={selectedQuickFilter}
          // editModeEnabled={wasChangedFilters}
          // selectedFilters={selectedFilters}
          />
          {isFilterApplied && tasksAndSubTasksCount === 0 && !isFetching && (
            <MegaFilterNoResultsLabel>
              There are no results for your filter criteria.
            </MegaFilterNoResultsLabel>
          )}
          {isDefaultDateFilterApplied && (
            <span>
              Displaying tasks completed in last 7 days. Adjust date criteria as
              needed.
            </span>
          )}
          <NewFilterContainer
            filters={filters}
            onSelectedFiltersChange={onSelectFilters}
            setFinalFilter={setFinalFilter}
            finalFilter={finalFilter}
            setMenuOption={setMenuOption}
            menuOptions={menuOptions}
            setAssignedUser={setAssignedUser}
            assignedUser={assignedUser}
          ></NewFilterContainer>
          <Box p={2} />
          {/* <FilterTable
            isLoading={isFetching}
            searchValue={searchedFilterQuery}
            filters={filters}
            selectedFilters={selectedFilters}
            onSelectedFiltersChange={onSelectFilters}
          >
            <CustomFilters
              quickFiltersList={quickFiltersList}
              addQuickFilterOption={addQuickFilterOption}
              selectedQuickFilter={selectedQuickFilter}
              selectQuickFilter={selectQuickFilter}
              onUpdate={onQuickFilterUpdate}
              editModeEnabled={wasChangedFilters}
              onCreate={onQuickFilterCreate}
              onDelete={onQuickFilterDelete}
            />
          </FilterTable> */}
        </>
      </FilterPopover>
    </MegaFilterContainer>
  );
};

export default MegaFilter;
