import React, { useRef, useState } from 'react';
import { isEmpty, isNil } from 'ramda';
import { Button } from '@material-ui/core';
import RotatableChevron from 'components/common/RotatableChevron';
import palette from 'styles/palette';
import {
  getFilterRowComponent,
  FilterRowUnassigned,
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
  filter: { label, list, type, isAvailableUnassgined, hasAvatars, key },
  selectedFilters,
  onSelectFilters,
}) => {
  const FilterRow = getFilterRowComponent(type);
  const columnSelectedFilters = selectedFilters[key];
  const isSelectedUnassigned = columnSelectedFilters?.includes(UNASSIGNED);
  const filteredList = list?.filter(
    ({ key: fieldKey }) => !columnSelectedFilters?.includes(fieldKey),
  );

  const onClick = value => {
    if (columnSelectedFilters) {
      if (columnSelectedFilters?.includes(value)) {
        onSelectFilters({
          ...selectedFilters,
          [key]: columnSelectedFilters.filter(
            filterValue => filterValue !== value,
          ),
        });
      } else {
        onSelectFilters({
          ...selectedFilters,
          [key]: [...columnSelectedFilters, value],
        });
      }
    } else {
      onSelectFilters({ ...selectedFilters, [key]: [value] });
    }
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

              if (filterValue === UNASSIGNED) {
                return (
                  <FilterRowUnassigned
                    hasAvatars={hasAvatars}
                    isSelected
                    onClick={() => onClick(UNASSIGNED)}
                  />
                );
              }

              return (
                <FilterRow
                  {...row}
                  isSelected
                  onClick={() => onClick(filterValue)}
                />
              );
            })}
          </FilterSelected>
        )}
        {isAvailableUnassgined && !isSelectedUnassigned && (
          <FilterRowUnassigned
            hasAvatars={hasAvatars}
            onClick={() => onClick(UNASSIGNED)}
          />
        )}
        {filteredList?.map(item => (
          <FilterRow {...item} onClick={() => onClick(item.key)} />
        ))}
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
}) => {
  const [isOpen, openPopover] = useState(false);
  const megaFilterReference = useRef(null);

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
          </MegaFilterHeader>
          <Filters>
            {Object.keys(filters)?.map(key => (
              <FilterColumn
                key={key}
                filter={{ ...filters[key], key }}
                selectedFilters={selectedFilters}
                onSelectFilters={onSelectFilters}
              />
            ))}
          </Filters>
        </Container>
      </MegaFilterPopover>
    </>
  );
};

export default MegaFilter;
