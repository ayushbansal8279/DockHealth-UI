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
import SaveFilterPopup from '../../filter/SaveFilterPopup/SaveFilterPopup';
import { useSelector } from 'react-redux';
import { currentTaskListSelector } from '@/app/selectors/task-list-selectors';
import FilterTableLoader from '../../filter/FilterTableLoader/FilterTableLoader';

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
  handleSaveQuickFilter,
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
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [quickFilterIdentifier, setQuickFilterIdentifier] = useState('');
  const [editIdentifier, setEditIdentifier] = useState('');

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
          {/* For Popup of save Filter */}
          <SaveFilterPopup
            quickFilterIdentifier={quickFilterIdentifier}
            setQuickFilterIdentifier={setQuickFilterIdentifier}
            refrence={megaFilterButtonReference}
            isSavePopupOpen={isSavePopupOpen}
            setSavePopupOpen={setSavePopupOpen}
            finalFilter={finalFilter}
            quickFiltersList={quickFiltersList}
            onQuickFilterCreate={onQuickFilterCreate}
            onQuickFilterUpdate={onQuickFilterUpdate}
            setEditIdentifier={setEditIdentifier}
            editIdentifier={editIdentifier}
          ></SaveFilterPopup>
          {/* Kept here for Future Refrence */}
          {/* <FilterHeader
          title="Filter tasks"
          filterActive={isFilterApplied}
          filteredItemsCount={tasksAndSubTasksCount}
          allItemsCount={activeItemsAmount}
          searchValue={searchedFilterQuery}
          onSearchValueChange={setSearchedFilterQuery}
          onClear={clearFilters}
          onSave={onSaveClick}
          onSaveAsNew={onSaveAsNewClick}
          selectedQuickFilter={selectedQuickFilter}
          editModeEnabled={wasChangedFilters}
          selectedFilters={selectedFilters}
          /> */}
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

          {filters ? (
            <CustomFilters
              setQuickFilterIdentifier={setQuickFilterIdentifier}
              setSavePopupOpen={setSavePopupOpen}
              quickFiltersList={quickFiltersList}
              addQuickFilterOption={addQuickFilterOption}
              selectedQuickFilter={selectedQuickFilter}
              selectQuickFilter={selectQuickFilter}
              onUpdate={onQuickFilterUpdate}
              editModeEnabled={wasChangedFilters}
              onCreate={onQuickFilterCreate}
              onDelete={onQuickFilterDelete}
              setMenuOption={setMenuOption}
              setFinalFilter={setFinalFilter}
              filters={filters}
              setEditIdentifier={setEditIdentifier}
              editIdentifier={editIdentifier}
            />
          ) : (
            <FilterTableLoader />
          )}
          <NewFilterContainer
            filters={filters}
            onSelectedFiltersChange={onSelectFilters}
            setFinalFilter={setFinalFilter}
            finalFilter={finalFilter}
            setMenuOption={setMenuOption}
            menuOptions={menuOptions}
            openPopover={openPopover}
            quickFiltersList={quickFiltersList}
            setSavePopupOpen={setSavePopupOpen}
            onQuickFilterCreate={onQuickFilterCreate}
            handleSaveQuickFilter={handleSaveQuickFilter}
            quickFilterIdentifier={quickFilterIdentifier}
          ></NewFilterContainer>
          <Box p={1} />
          {/* Kept here for Future Refrence */}
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
