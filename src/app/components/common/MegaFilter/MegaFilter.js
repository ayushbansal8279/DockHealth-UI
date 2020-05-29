import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty, isNil } from 'ramda';
import { Button } from '@material-ui/core';
import RotatableChevron from 'components/common/RotatableChevron';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { getFilteredTasksForList } from 'actions/task-actions';
import {
  getFilterRowComponent,
  AssignedOrUnassignedRow,
} from './MegaFilterRowComponents';

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
  ClearButton,
} from './styled';

const UNASSIGNED = 'UNASSIGNED';

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
  taskList,
  taskStatus,
  filters,
}) => {
  const FilterRow = getFilterRowComponent(type);
  const columnSelectedFilters = selectedFilters[key];
  const filteredList = list?.filter(
    ({ key: fieldKey }) => !columnSelectedFilters?.includes(fieldKey),
  );

  const dispatch = useDispatch();

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

    const taskFilters = {};
    Object.keys(updatedFilters).forEach(keyIndex => {
      const { filterKey } = filters[keyIndex];
      taskFilters[filterKey] = updatedFilters[keyIndex];
    });

    onSelectFilters(updatedFilters);
    getFilteredTasksForList(
      taskList?.taskListIdentifier,
      taskStatus,
      taskFilters,
    )(dispatch);
  };

  return (
    <StyledFilter>
      <FilterLabel>{label}</FilterLabel>
      <FilterList>
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
        {filteredList?.map(item => {
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
  const megaFilterReference = useRef(null);

  const dispatch = useDispatch();

  const clearFilters = () => {
    onSelectFilters([]);
    getFilteredTasksForList(
      taskList?.taskListIdentifier,
      taskStatus,
      {},
    )(dispatch);
  };

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
            <Spacing horizontal={4} />
            <ClearButton type="button" onClick={clearFilters}>
              CLEAR
            </ClearButton>
          </MegaFilterHeader>
          <Filters>
            {Object.keys(filters)?.map(key => (
              <FilterColumn
                key={key}
                filter={{ ...filters[key], key }}
                selectedFilters={selectedFilters}
                onSelectFilters={onSelectFilters}
                taskList={taskList}
                taskStatus={taskStatus}
                filters={filters}
              />
            ))}
          </Filters>
        </Container>
      </MegaFilterPopover>
    </>
  );
};

export default MegaFilter;
