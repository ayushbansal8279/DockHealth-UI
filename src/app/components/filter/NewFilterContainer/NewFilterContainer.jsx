import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { MenuItem, Select } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FilterIcon from 'img/Group_Filter.svg';
import {
  BottomWrapper,
  FilterButtonWrapper,
  FilterLableContainer,
  ClearFilter,
  Divider,
} from './styled';
import FilterSelect from '../FilterSelect/FilterSelect';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilterOption } from 'helpers/filter-options-helpers';
import { createQuickFilter } from 'actions/mega-filter-actions';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { getUniqueQuickFilterLabelName } from '../CustomFilters/helpers';

const NewFilterContainer = ({
  filters,
  onSelectedFiltersChange,
  menuOptions,
  setMenuOption,
  finalFilter,
  setFinalFilter,
  setOptions,
  options,
  openPopover,
  quickFiltersList,
}) => {
  const taskList = useSelector(currentTaskListSelector);
  const { taskListIdentifier } = taskList || {};
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuOption(filters?.map((item) => ({ label: item.label, id: item.id })));
  }, [filters]);

  const handleClick = (option) => {
    menuOptions.map((item) => {
      if (
        option === item.id &&
        !Object.keys(finalFilter).find((select) => select === option)
      ) {
        const obs = {};
        obs[option] = [];
        setFinalFilter((v) => ({ ...v, ...obs }));
        setOptions((v) => ({ ...v, ...obs }));
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
    setOptions([]);
  };

  const handleQuickFilterCreate = () => {
    const data = {};
    for (const key in finalFilter) {
      if (finalFilter[key].length > 0) {
        data[key] = { options: finalFilter[key].map((item) => item.key) };
      }
    }
    dispatch(
      createQuickFilter(
        getUniqueQuickFilterLabelName(quickFiltersList),
        { taskListIdentifier },
        data,
      ),
    );
  };

  console.log(finalFilter);

  return (
    <>
      {Object.keys(finalFilter).map((filter) => (
        <FilterSelect
          setOptions={setOptions}
          options={options}
          menuOptions={menuOptions}
          setFilter={setFinalFilter}
          filter={filter}
          finalFilter={finalFilter}
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
        <CancelButton
          disabled={Object.keys(finalFilter).length === 0}
          onClick={handleQuickFilterCreate}
          style={{ width: '270px' }}
        >
          Save Filter
        </CancelButton>
        <ConfirmButton
          disabled={Object.keys(finalFilter).length === 0}
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
