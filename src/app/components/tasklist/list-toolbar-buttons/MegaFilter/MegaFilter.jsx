/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import isEmpty from 'ramda/src/isEmpty';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import CustomFilters from 'components/filter/CustomFilters/CustomFilters';
import { MegaFilterNoResultsLabel, MegaFilterContainer } from './styled';
import NewFilterContainer from '../../../filter/NewFilterContainer/NewFilterContainer';
import SaveFilterPopup from '../../../filter/SaveFilterPopup/SaveFilterPopup';
import FilterTableLoader from '../../../filter/FilterTableLoader/FilterTableLoader';
import { selectFilterOption } from '@/app/helpers/filter-options-helpers';

const MegaFilter = ({
  children,
  filters,
  selectedFilters,
  selectedQuickFilter: initialQuickFilter,
  onSelectFilters,
  tasksAndSubTasksCount,
  isFetching,
  onOpen,
  quickFiltersList,
  addQuickFilterOption,
  selectQuickFilter,
  onQuickFilterUpdate,
  wasChangedFilters,
  onQuickFilterCreate,
  onQuickFilterDelete,
  isDefaultDateFilterApplied = false,
  value,
  focused,
  showFilterCount,
}) => {
  const [isOpen, openPopover] = useState(false);
  const megaFilterButtonReference = useRef(null);
  const [finalFilter, setFinalFilter] = useState({});
  const [customFinalFilter, setCustomFinalFilter] = useState({});
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [editIdentifier, setEditIdentifier] = useState('');
  const [filteredData, setFilteredData] = useState({});
  const [fiterCount, setFilterCount] = useState(-1);
  const [customFilteredData, setCustomFilteredData] = useState({});
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('');


  const isFilterApplied = selectedFilters && !isEmpty(selectedFilters);

  useEffect(() => {
    const data = {};
    if (selectedFilters && filters) {
      for (const key in selectedFilters) {
        if (key !== '') {
          const users = filters
            .flatMap((item) => item.id === key && item.options)
            .filter((item) => typeof item !== 'boolean');

          const options = selectedFilters[key].options.map((item) => {
            if (item?.includes('DATE_RANGE')) {
              let foundOption = users.find((user) => user.key === item);
              foundOption = {
                ...foundOption,
                dateStart: selectedFilters[key].dateStart,
                dateEnd: selectedFilters[key].dateEnd,
              };
              return foundOption;
            }
            if (item?.includes('DATE_SINGLE')) {
              let foundOption = users.find((user) => user.key === item);
              foundOption = {
                ...foundOption,
                date: selectedFilters[key].date,
              };
              return foundOption;
            }
            if (item?.includes('NUMBER_RANGE')) {
              let foundOption = users.find((user) => user.key === item);
              foundOption = {
                ...foundOption,
                numberStart: selectedFilters[key].numberStart,
                numberEnd: selectedFilters[key].numberEnd,
              };
              return foundOption;
            }
            if (item?.includes('SINGLE_NUMBER')) {
              let foundOption = users.find((user) => user.key === item);
              foundOption = {
                ...foundOption,
                singleNumber: selectedFilters[key].singleNumber,
              };
              return foundOption;
            }
            return users.find((user) => user.key === item);
          });
          data[key] = options;
        }
      }
      setFinalFilter(data);
    }
  }, [selectedFilters, filters, selectedQuickFilter]);

  const clearFilters = useCallback(() => {
    selectQuickFilter(null);
    setFinalFilter({});
    setSelectedQuickFilter('');
  }, [selectQuickFilter]);


  useEffect(() => {
    setSelectedQuickFilter(initialQuickFilter);
  }, [initialQuickFilter]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (isOpen) onOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const quickFilterInfo = quickFiltersList?.find(
    (filter) => filter.quickFilterIdentifier === selectedQuickFilter,
  );

  const handleSelectedFiltersChange = () => {
    onSelectFilters(selectFilterOption('', '', filteredData));
  };

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
            setFinalFilter={setFinalFilter}
            openPopover={openPopover}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            customFinalFilter={customFinalFilter}
            setCustomFinalFilter={setCustomFinalFilter}
            selectedQuickFilter={selectedQuickFilter}
            setSelectedQuickFilter={setSelectedQuickFilter}
            customFilteredData={customFilteredData}
            setCustomFilteredData={setCustomFilteredData}
            selectQuickFilter={selectQuickFilter}
            handleSelectedFiltersChange={handleSelectedFiltersChange}
            fiterCount={fiterCount}
            setFilterCount={setFilterCount}
            showFilterCount={showFilterCount}
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
              setFinalFilter={setFinalFilter}
              filters={filters}
              setEditIdentifier={setEditIdentifier}
              editIdentifier={editIdentifier}
              customFinalFilter={customFinalFilter}
              setCustomFinalFilter={setCustomFinalFilter}
              openPopover={openPopover}
              selectedQuickFilter={selectedQuickFilter}
              setSelectedQuickFilter={setSelectedQuickFilter}
              origin={origin}
            />
          ) : (
            <FilterTableLoader />
          )}
          {!quickFilterInfo?.predefined && (
            <>
              {filters ? (
                <NewFilterContainer
                  filters={filters}
                  setFinalFilter={setFinalFilter}
                  finalFilter={finalFilter}
                  openPopover={openPopover}
                  quickFiltersList={quickFiltersList}
                  setSavePopupOpen={setSavePopupOpen}
                  onQuickFilterCreate={onQuickFilterCreate}
                  setFilteredData={setFilteredData}
                  filteredData={filteredData}
                  customFinalFilter={customFinalFilter}
                  setCustomFinalFilter={setCustomFinalFilter}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  handleSelectedFiltersChange={handleSelectedFiltersChange}
                  fiterCount={fiterCount}
                  setFilterCount={setFilterCount}
                  showFilterCount={showFilterCount}
                />
              ) : (
                <></>
              )}
            </>
          )}
          <Box p={1} />
        </>
      </FilterPopover>
    </MegaFilterContainer>
  );
};

export default MegaFilter;
