/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import isEmpty from 'ramda/src/isEmpty';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
// import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
// import FilterTable from 'components/filter/FilterTable/FilterTable';
import CustomFilters from 'components/filter/CustomFilters/CustomFilters';
import { MegaFilterNoResultsLabel, MegaFilterContainer } from './styled';
import NewFilterContainer from '../../../filter/NewFilterContainer/NewFilterContainer';
import SaveFilterPopup from '../../../filter/SaveFilterPopup/SaveFilterPopup';
// import { currentTaskListSelector } from '@/app/selectors/task-list-selectors';
import FilterTableLoader from '../../../filter/FilterTableLoader/FilterTableLoader';

const MegaFilter = ({
  children,
  filters,
  selectedFilters,
  onSelectFilters,
  // activeItemsAmount,
  tasksAndSubTasksCount,
  isFetching,
  onOpen,
  quickFiltersList,
  addQuickFilterOption,
  selectQuickFilter,
  handleSaveQuickFilter,
  // onSaveAsNewClick,
  onQuickFilterUpdate,
  wasChangedFilters,
  onQuickFilterCreate,
  onQuickFilterDelete,
  isDefaultDateFilterApplied = false,
  value,
  focused,
}) => {
  const [isOpen, openPopover] = useState(false);
  // const [searchedFilterQuery, setSearchedFilterQuery] = useState('');
  const megaFilterButtonReference = useRef(null);
  const isFilterApplied = selectedFilters && !isEmpty(selectedFilters);
  const [menuOptions, setMenuOption] = useState([]);
  const [finalFilter, setFinalFilter] = useState({});
  const [customFinalFilter, setCustomFinalFilter] = useState({});
  const [selectedCustomFilter, setSelectedCustomFilter] = useState({});
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [editIdentifier, setEditIdentifier] = useState('');
  const [filteredData, setFilteredData] = useState({});
  const [customFilteredData, setCustomFilteredData] = useState({});
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('');

  const clearFilters = () => {
    onSelectFilters(null);
    selectQuickFilter(null);
    setFinalFilter({});
    setSelectedQuickFilter('');
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
          <SaveFilterPopup
            refrence={megaFilterButtonReference}
            isSavePopupOpen={isSavePopupOpen}
            setSavePopupOpen={setSavePopupOpen}
            finalFilter={finalFilter}
            quickFiltersList={quickFiltersList}
            onQuickFilterCreate={onQuickFilterCreate}
            onQuickFilterUpdate={onQuickFilterUpdate}
            setEditIdentifier={setEditIdentifier}
            editIdentifier={editIdentifier}
            filters={filters}
            onSelectedFiltersChange={onSelectFilters}
            setFinalFilter={setFinalFilter}
            setMenuOption={setMenuOption}
            menuOptions={menuOptions}
            openPopover={openPopover}
            handleSaveQuickFilter={handleSaveQuickFilter}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            customFinalFilter={customFinalFilter}
            setCustomFinalFilter={setCustomFinalFilter}
            selectedQuickFilter={selectedQuickFilter}
            setSelectedQuickFilter={setSelectedQuickFilter}
            customFilteredData={customFilteredData}
            setCustomFilteredData={setCustomFilteredData}
            selectedCustomFilter={selectedCustomFilter}
            selectQuickFilter={selectQuickFilter}
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

          {filters ? (
            <CustomFilters
              setSavePopupOpen={setSavePopupOpen}
              quickFiltersList={quickFiltersList}
              addQuickFilterOption={addQuickFilterOption}
              selectQuickFilter={selectQuickFilter}
              onUpdate={onQuickFilterUpdate}
              editModeEnabled={wasChangedFilters}
              onQuickFilterCreate={onQuickFilterCreate}
              onDelete={onQuickFilterDelete}
              setMenuOption={setMenuOption}
              setFinalFilter={setFinalFilter}
              filters={filters}
              setEditIdentifier={setEditIdentifier}
              editIdentifier={editIdentifier}
              customFinalFilter={customFinalFilter}
              setCustomFinalFilter={setCustomFinalFilter}
              openPopover={openPopover}
              selectedQuickFilter={selectedQuickFilter}
              setSelectedQuickFilter={setSelectedQuickFilter}
              clearFilters={clearFilters}
              setSelectedCustomFilter={setSelectedCustomFilter}
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
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            customFinalFilter={customFinalFilter}
            setCustomFinalFilter={setCustomFinalFilter}
            setSelectedQuickFilter={setSelectedQuickFilter}
          />
          <Box p={1} />
        </>
      </FilterPopover>
    </MegaFilterContainer>
  );
};

export default MegaFilter;
