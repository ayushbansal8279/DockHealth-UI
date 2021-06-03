import React, { useRef, useState, useEffect } from 'react';
import { isEmpty, isNil, partition } from 'ramda';
import { onFilterChanged } from 'helpers/ga-event-helper';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
import {
  getFilterRowComponent,
  AssignedOrUnassignedRow,
} from './MegaFilterRowComponents';
import MegaFilterSearch from './MegaFilterSearch';

import {
  MegaFilterPopover,
  Container,
  FilterButtonWrapper,
  FilterButtonLabel,
  FilterClearButtonWrapper,
  FilterClearButtonLabel,
  MegaFilterHeader,
  MegaFilterSubHeader,
  MegaFilterLabel,
  MegaFilterNoResultsLabel,
  MegaFilterBoldedLabel,
  StyledFilter,
  Filters,
  FilterList,
  FilterLabel,
  FilterSelected,
  FilterSearched,
  ClearButton,
  MegaFilterLeftOptions,
  MegaFilterOptions,
} from './styled';

const UNASSIGNED = 'UNASSIGNED';

const SEARCH_EXCLUDE_KEYS = ['DUE_DATE_RANGE'];

const FilterButton = ({ isOpen, openPopover, isFilterApplied }) => (
  <FilterButtonWrapper
    variant="text"
    onClick={() => openPopover(!isOpen)}
    size="small"
    filtered={isFilterApplied ? 'true' : 'false'}
  >
    <FilterButtonLabel
      variant="body1"
      component="span"
      filtered={isFilterApplied ? 'true' : 'false'}
    >
      FILTER
    </FilterButtonLabel>
    <RotatableChevron
      rotated={isOpen}
      color={isFilterApplied ? palette.white : palette.brightBlue}
    />
  </FilterButtonWrapper>
);

const FilterClearButton = ({ clearFilters }) => (
  <FilterClearButtonWrapper
    variant="text"
    onClick={() => clearFilters()}
    size="small"
  >
    <FilterClearButtonLabel variant="body1" component="span">
      CLEAR
    </FilterClearButtonLabel>
  </FilterClearButtonWrapper>
);

const FilterColumn = ({
  filter: { label, list, type, hasAvatars, key },
  selectedFilters,
  onSelectFilters,
  searchedFilterQuery,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const FilterRow = getFilterRowComponent(type);
  const columnSelectedFilters = selectedFilters[key];

  const additionalProps = {};

  if (key === 'dueDateOptions') {
    additionalProps.customDueDateStart = selectedFilters.customDueDateStart;
    additionalProps.customDueDateEnd = selectedFilters.customDueDateEnd;
  }

  const filteredList = list?.filter(
    ({ key: fieldKey }) => !columnSelectedFilters?.includes(fieldKey),
  );

  const [searchedFiletrs, unsearchedFiletrs] = partition(
    ({ displayValue, key: itemKey }) =>
      searchedFilterQuery &&
      displayValue
        ?.toLowerCase()
        .includes(searchedFilterQuery?.toLowerCase()) &&
      !SEARCH_EXCLUDE_KEYS.includes(itemKey),
    filteredList || [],
  );

  const onClick = value => {
    let updatedFilters = selectedFilters;
    if (columnSelectedFilters) {
      if (columnSelectedFilters?.includes(value)) {
        updatedFilters = {
          ...selectedFilters,
          [key]: columnSelectedFilters.filter(
            filterValue => filterValue !== value,
          ),
        };
        if (updatedFilters[key]?.length === 0) {
          delete updatedFilters[key];
        }
      } else {
        updatedFilters = {
          ...selectedFilters,
          [key]: [...columnSelectedFilters, value],
        };
      }
    } else {
      updatedFilters = { ...selectedFilters, [key]: [value] };
    }

    onFilterChanged(key);
    onSelectFilters(updatedFilters);
  };

  const dueDateChange = (startDate, endDate) => {
    const updatedFilters = {
      ...selectedFilters,
      customDueDateStart: startDate,
      customDueDateEnd: endDate,
    };
    onSelectFilters(updatedFilters);
  };

  return (
    <StyledFilter>
      <FilterLabel>{label}</FilterLabel>
      <FilterList>
        {!isEmpty(searchedFiletrs) && (
          <FilterSearched>
            {searchedFiletrs?.map(item => {
              const itemKey = item.key;
              return (
                <AssignedOrUnassignedRow
                  itemKey={itemKey}
                  isUnassigned={itemKey === UNASSIGNED}
                  hasAvatars={hasAvatars}
                  onClick={() => onClick(itemKey)}
                  dueDateChange={dueDateChange}
                  {...additionalProps}
                  {...item}
                >
                  <FilterRow />
                </AssignedOrUnassignedRow>
              );
            })}
          </FilterSearched>
        )}
        {!isEmpty(columnSelectedFilters) && !isNil(columnSelectedFilters) && (
          <FilterSelected>
            {columnSelectedFilters?.map(filterValue => {
              const row = list?.find(
                ({ key: fieldKey }) => fieldKey === filterValue,
              );
              return (
                <AssignedOrUnassignedRow
                  isSelected
                  onClick={() => onClick(filterValue)}
                  isUnassigned={filterValue === UNASSIGNED}
                  hasAvatars={hasAvatars}
                  itemKey={filterValue}
                  {...row}
                >
                  <FilterRow />
                </AssignedOrUnassignedRow>
              );
            })}
          </FilterSelected>
        )}
        {unsearchedFiletrs?.map(item => {
          const itemKey = item.key;
          return (
            <AssignedOrUnassignedRow
              itemKey={itemKey}
              isUnassigned={itemKey === UNASSIGNED}
              hasAvatars={hasAvatars}
              onClick={() => onClick(itemKey)}
              {...additionalProps}
              dueDateChange={dueDateChange}
              {...item}
            >
              <FilterRow />
            </AssignedOrUnassignedRow>
          );
        })}
      </FilterList>
    </StyledFilter>
  );
};

const MegaFilter = ({
  children,
  filters,
  activeItemsAmount,
  selectedFilters,
  onSelectFilters,
  taskList,
  taskStatus,
  tasksAndSubTasksCount,
  isFetching,
  popoverStyles = {},
}) => {
  const [isOpen, openPopover] = useState(false);
  const [searchedFilterQuery, setSearchedFilterQuery] = useState('');
  const megaFilterReference = useRef(null);

  const clearFilters = () => {
    onSelectFilters({});
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // checking if selected filters keys are present on filters list
    if (!isEmpty(filters) && !isEmpty(selectedFilters)) {
      let shouldUpdate = false;
      const updatedSelectedFilters = {};

      Object.keys(selectedFilters).forEach(key => {
        if (Array.isArray(selectedFilters[key])) {
          const foundFilterColumn = filters.find(
            filter => filter.filterKey === key,
          );

          selectedFilters[key].forEach(selectedFilterKeyValue => {
            if (
              foundFilterColumn?.list
                .map(listElement => listElement.key)
                .includes(selectedFilterKeyValue)
            ) {
              if (!updatedSelectedFilters[key]) {
                updatedSelectedFilters[key] = [];
              }
              updatedSelectedFilters[key].push(selectedFilterKeyValue);
            } else {
              shouldUpdate = true;
            }
          });
        }
      });

      if (shouldUpdate) {
        onSelectFilters(updatedSelectedFilters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const isFilterApplied = !isEmpty(selectedFilters);
  return (
    <>
      <div ref={megaFilterReference}>
        {children || (
          <FilterButton
            isOpen={isOpen}
            openPopover={openPopover}
            isFilterApplied={isFilterApplied}
            selectedFilters={selectedFilters}
          />
        )}
        {isFilterApplied && <FilterClearButton clearFilters={clearFilters} />}
      </div>
      <MegaFilterPopover
        customStyles={popoverStyles}
        anchorEl={megaFilterReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <Container>
          <MegaFilterHeader>
            <MegaFilterLeftOptions>
              <>
                <MegaFilterLabel>
                  <MegaFilterBoldedLabel>
                    FILTER ACTIVE TASKS{' '}
                  </MegaFilterBoldedLabel>
                  {isFilterApplied && tasksAndSubTasksCount && (
                    <>
                      SHOWING {tasksAndSubTasksCount} OF {activeItemsAmount}{' '}
                      ITEMS
                    </>
                  )}
                  {isFilterApplied && !tasksAndSubTasksCount && (
                    <>SHOWING {activeItemsAmount} ITEMS</>
                  )}
                </MegaFilterLabel>
                {isFilterApplied && (
                  <ClearButton type="button" onClick={clearFilters}>
                    CLEAR
                  </ClearButton>
                )}
              </>
            </MegaFilterLeftOptions>
            <MegaFilterOptions>
              <MegaFilterSearch
                onSearch={setSearchedFilterQuery}
                value={searchedFilterQuery}
              />
            </MegaFilterOptions>
          </MegaFilterHeader>
          <MegaFilterSubHeader>
            {isFilterApplied && tasksAndSubTasksCount === 0 && !isFetching && (
              <MegaFilterNoResultsLabel>
                There are no results for your filter criteria.
              </MegaFilterNoResultsLabel>
            )}
          </MegaFilterSubHeader>
          <Filters>
            {!isEmpty(filters) &&
              filters
                ?.filter(filter => !isEmpty(filter.list))
                .map(filter => (
                  <FilterColumn
                    key={filter.filterKey}
                    filter={{ ...filter, key: filter.filterKey }}
                    selectedFilters={selectedFilters}
                    onSelectFilters={onSelectFilters}
                    taskList={taskList}
                    taskStatus={taskStatus}
                    filters={filters}
                    searchedFilterQuery={searchedFilterQuery}
                  />
                ))}
          </Filters>
        </Container>
      </MegaFilterPopover>
    </>
  );
};

export default MegaFilter;
