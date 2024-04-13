import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { Button, Menu, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import FilterIcon from 'img/Group_Filter.svg';
import {
  AssigneDropDown,
  AssigneDropDownItem,
  AssigneHolder,
  AssigneInput,
  AssigneItem,
  BottomWrapper,
  FilterButtonWrapper,
  FilterLableContainer,
  FilterLable,
  ClearFilter,
  Divider,
} from './styled';
import FilterSelect from '../FilterSelect/FilterSelect';
import { filterListDetailsTasks } from '@/app/actions/list-details-actions';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardMyTasksFilters } from '@/app/api/dashboard-api';
import {
  extractSelectedOptions,
  FilterOptionsCategory,
  selectFilterOption,
  setFilterRangeDate,
  unselectFilterOption,
} from 'helpers/filter-options-helpers';

const NewFilterContainer = ({
  filters,
  onSelectedFiltersChange,
  menuOptions,
  setMenuOption,
  finalFilter,
  setFinalFilter,
  setAssignedUser,
  assignedUser,
  openPopover,
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setMenuOption(filters?.map((item) => ({ label: item.label, id: item.id })));
  }, [filters]);

  const handleClick = (option) => {
    setIsSelectOpen(true);
    menuOptions.map((item) => {
      if (
        option === item.id &&
        !Object.keys(finalFilter).find((select) => select === option)
      ) {
        const obs = {};
        obs[option] = [];
        setFinalFilter((v) => ({ ...v, ...obs }));
        setAssignedUser((v) => ({ ...v, ...obs }));
      }
    });
  };

  const handleApplyFinalFilter = () => {
    const data = {};
    for (const key in finalFilter) {
      if (finalFilter[key].length > 0) {
        data[key] = { options: finalFilter[key].map((item) => item.key) };
      }
    }
    onSelectedFiltersChange(selectFilterOption('', '', data));
    openPopover(false);
  };

  const clearFilter = () => {
    setFinalFilter({});
    setAssignedUser([]);
  };

  return (
    <>
      {Object.keys(finalFilter).map((filter) => (
        <FilterSelect
          setAssignedUser={setAssignedUser}
          assignedUser={assignedUser}
          menuOptions={menuOptions}
          setFilter={setFinalFilter}
          filter={filter}
          finalFilter={finalFilter}
          // filterOptions={() => {
          //   const uniqueOptions = new Set(); // Using Set to store unique values

          //   filters.forEach((item) => {
          //     if (item.id === filter && item.options) {
          //       item.options.forEach((option) => {
          //         if (typeof option !== 'boolean') {
          //           uniqueOptions.add(option); // Adding unique options to the Set
          //         }
          //       });
          //     }
          //   });

          //   return Array.from(uniqueOptions);
          // }}
          filterOptions={filters
            .flatMap((item) => item.id === filter && item.options)
            .filter((item) => typeof item !== 'boolean')}
        />
      ))}
      <FilterButtonWrapper>
        <Select
          sx={{
            background: '#0E244A',
            width: '110px',
            height: '32px',
            border: 'none',
          }}
          value={'Add Filter'}
          renderValue={() => (
            <FilterLableContainer>
              <img src={FilterIcon} alt="filter" /> Add Filter
            </FilterLableContainer>
          )}
        >
          {menuOptions?.map((option) => (
            <MenuItem onClick={() => handleClick(option.id)} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <ClearFilter onClick={clearFilter}>Clear Filter</ClearFilter>
      </FilterButtonWrapper>
      <Divider />
      <BottomWrapper>
        <CancelButton style={{ width: '270px' }}>Save Filter</CancelButton>
        <ConfirmButton
          style={{ width: '270px' }}
          onClick={handleApplyFinalFilter}
        >
          Apply Filter
        </ConfirmButton>
      </BottomWrapper>
    </>
  );
};

export default NewFilterContainer;
