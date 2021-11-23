import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isEmpty, isNil, partition } from 'ramda';
import { onFilterChanged } from 'helpers/ga-event-helper';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import FilterOptionsGroup from 'components/filter/FilterOptionsGroup/FilterOptionsGroup';
import {
  getFilterRowComponent,
  AssignedOrUnassignedRow,
} from './MegaFilterRowComponents';
import { MegaFilterNoResultsLabel } from './styled';

const UNASSIGNED = 'UNASSIGNED';

const SEARCH_EXCLUDE_KEYS = ['DUE_DATE_RANGE'];

const FilterColumn = ({
  filter: { label, list, type, hasAvatars, key },
  selectedFilters,
  onSelectFilters,
  searchedFilterQuery,
  customerTypeLabelCapitalized,
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

  let colLabel = '';
  if (label === 'Patients') {
    colLabel = `${customerTypeLabelCapitalized}s`;
  } else {
    colLabel = label;
  }

  return (
    <FilterOptionsColumn label={colLabel}>
      {!isEmpty(searchedFiletrs) && (
        <FilterOptionsGroup>
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
        </FilterOptionsGroup>
      )}
      <FilterOptionsGroup>
        {!isEmpty(columnSelectedFilters) &&
          !isNil(columnSelectedFilters) &&
          columnSelectedFilters?.map(filterValue => {
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
      </FilterOptionsGroup>
    </FilterOptionsColumn>
  );
};

const MegaFilter = ({
  children,
  filters,
  selectedFilters,
  onSelectFilters,
  activeItemsAmount,
  tasksAndSubTasksCount,
  isFetching,
}) => {
  const [isOpen, openPopover] = useState(false);
  const [searchedFilterQuery, setSearchedFilterQuery] = useState('');
  const megaFilterButtonReference = useRef(null);

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

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
          <FilterScrollableRow>
            {!isEmpty(filters) &&
              filters
                ?.filter(filter => !isEmpty(filter.list))
                .map((filter, index) => (
                  <>
                    {index !== 0 && <Box m={1} />}
                    <FilterColumn
                      key={filter.filterKey}
                      filter={{ ...filter, key: filter.filterKey }}
                      selectedFilters={selectedFilters}
                      onSelectFilters={onSelectFilters}
                      filters={filters}
                      searchedFilterQuery={searchedFilterQuery}
                      customerTypeLabelCapitalized={
                        customerTypeLabelCapitalized
                      }
                    />
                  </>
                ))}
          </FilterScrollableRow>
        </>
      </FilterPopover>
    </>
  );
};

export default MegaFilter;
