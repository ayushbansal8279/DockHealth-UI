import React, { useRef, useState, useEffect } from 'react';
import { isEmpty, isNil, partition } from 'ramda';
import { Button } from '@material-ui/core';
import RotatableChevron from 'components/common/RotatableChevron';
import palette from 'styles/palette';
import {
  getFilterRowComponent,
  AssignedOrUnassignedRow,
} from './MegaFilterRowComponents';
import MegaFilterSearch from './MegaFilterSearch';

import {
  MegaFilterPopover,
  Container,
  FilterButtonLabel,
  MegaFilterHeader,
  MegaFilterLabel,
  MegaFilterBoldedLabel,
  StyledFilter,
  Filters,
  FilterList,
  FilterLabel,
  FilterSelected,
  FilterSearched,
  ClearButton,
  MegaFilterOptions,
} from './styled';

const UNASSIGNED = 'UNASSIGNED';

const SEARCH_EXCLUDE_KEYS = ['DUE_DATE_RANGE'];

const FilterButton = ({ isOpen, openPopover }) => (
  <Button variant="text" onClick={() => openPopover(!isOpen)} size="small">
    <FilterButtonLabel variant="body1" component="span">
      FILTER
    </FilterButtonLabel>
    <RotatableChevron rotated={isOpen} color={palette.brightBlue} />
  </Button>
);

const FilterColumn = ({
  filter: { label, list, type, hasAvatars, key },
  selectedFilters,
  onSelectFilters,
  searchedFilterQuery,
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
      } else {
        updatedFilters = {
          ...selectedFilters,
          [key]: [...columnSelectedFilters, value],
        };
      }
    } else {
      updatedFilters = { ...selectedFilters, [key]: [value] };
    }

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
}) => {
  const [isOpen, openPopover] = useState(false);
  const [searchedFilterQuery, setSearchedFilterQuery] = useState('');
  const megaFilterReference = useRef(null);

  const clearFilters = () => {
    onSelectFilters({});
  };

  useEffect(() => {
    // checking if selected filters keys are present on filters list
    if (!isEmpty(filters) && !isEmpty(selectedFilters)) {
      let shouldUpdate = false;
      const updatedSelectedFilters = {};

      Object.keys(selectedFilters).forEach(key => {
        return selectedFilters[key].forEach(selectedFilterKeyValue => {
          const foundFilterColumn = filters.find(
            filter => filter.filterKey === key,
          );
          if (
            foundFilterColumn.list
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
      });

      if (shouldUpdate) {
        onSelectFilters(updatedSelectedFilters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <div ref={megaFilterReference}>
        {children || <FilterButton isOpen={isOpen} openPopover={openPopover} />}
      </div>
      <MegaFilterPopover
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
            <MegaFilterLabel>
              <MegaFilterBoldedLabel>
                FILTER ACTIVE TASKS{' '}
              </MegaFilterBoldedLabel>
              {activeItemsAmount} ITEMS
            </MegaFilterLabel>
            <MegaFilterOptions>
              <MegaFilterSearch
                onSearch={setSearchedFilterQuery}
                value={searchedFilterQuery}
              />
              <ClearButton type="button" onClick={clearFilters}>
                CLEAR ALL
              </ClearButton>
            </MegaFilterOptions>
          </MegaFilterHeader>
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
