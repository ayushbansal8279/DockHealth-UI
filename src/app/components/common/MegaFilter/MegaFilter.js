import React, { useRef, useState } from 'react';
import { useMount } from 'react-use';
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
    onSelectFilters([]);
  };

  useMount(() => {
    if (!isEmpty(selectedFilters)) {
      onSelectFilters(selectedFilters);
    }
  });

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
            {Object.keys(filters)
              ?.filter(key => !isEmpty(filters[key].list))
              .map(key => (
                <FilterColumn
                  key={key}
                  filter={{ ...filters[key], key }}
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
