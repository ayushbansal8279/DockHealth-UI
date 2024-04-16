import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { Box, MenuItem, Select } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import FilterIcon from 'img/Group_Filter.svg';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  BottomWrapper,
  FilterButtonWrapper,
  FilterLableContainer,
  ClearFilter,
  Divider,
  BoxContainer,
  AddFilterButtonContainer,
  AddFilterRotatableChevronButtonWrapper,
  AddFilterRotatableChevronButtonLabel,
  AddFilterButtonLabel,
  // FilterHorizontalLineContainer,
  // FilterHorizontalLine,
  ClearFilterButton,
  ClearFilterLabel,
} from './styled';
import FilterSelect from '../FilterSelect/FilterSelect';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilterOption } from 'helpers/filter-options-helpers';
import { createQuickFilter } from 'actions/mega-filter-actions';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { getUniqueQuickFilterLabelName } from '../CustomFilters/helpers';
import RotatableChevron from '../../common/RotatableChevron/RotatableChevron';
import palette from '@/app/styles/palette';
import useBoolean from '@/app/hooks/useBoolean';
import FilterOptionsPopover from './FilterOptionsPopover';

const NewFilterContainer = ({
  filters,
  onSelectedFiltersChange,
  menuOptions,
  setMenuOption,
  finalFilter,
  setFinalFilter,
  openPopover,
  setSavePopupOpen,
  handleSaveQuickFilter,
  quickFilterIdentifier,
}) => {
  const popoverReference = useRef(null);
  const [isPopoverOpen, openAddFilterPopover, closeAddFilterPopover] =
    useBoolean(false);
  const [isUpdate, setUpdate] = useState(false);

  useEffect(() => {
    setMenuOption(filters?.map((item) => ({ label: item.label, id: item.id })));
  }, [filters, finalFilter]);

  const handleClick = (option) => {
    menuOptions.map((item) => {
      if (
        option === item.id &&
        !Object.keys(finalFilter).find((select) => select === option)
      ) {
        const obs = {};
        obs[option] = [];
        setFinalFilter((v) => ({ ...v, ...obs }));
      }
    });
    closeAddFilterPopover();
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

  const handleClose = useCallback(() => {
    closeAddFilterPopover();
  }, [closeAddFilterPopover]);

  const clearFilter = () => {
    setFinalFilter({});
  };

  useEffect(() => {
    if (quickFilterIdentifier !== '') {
      setUpdate(true);
    } else {
      setUpdate(false);
    }
  }, [quickFilterIdentifier]);

  const updateFilter = () => {
    if (isUpdate) {
      const data = {};
      for (const key in finalFilter) {
        if (finalFilter[key].length > 0) {
          data[key] = { options: finalFilter[key].map((item) => item.key) };
        }
      }
      handleSaveQuickFilter(data);
    } else {
      setSavePopupOpen(true);
    }
  };

  return (
    <>
      {Object.keys(finalFilter).map((filter) => (
        <FilterSelect
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
        <BoxContainer ref={popoverReference}>
          <AddFilterButtonContainer
            variant="text"
            onClick={openAddFilterPopover}
            size="large"
          >
            <FilterListIcon fontSize="medium" />
            <AddFilterButtonLabel variant="body1" component="span">
              Add Filter
            </AddFilterButtonLabel>
          </AddFilterButtonContainer>
          <Box display="flex" width="3px">
            <AddFilterRotatableChevronButtonWrapper
              variant="text"
              onClick={openAddFilterPopover}
              size="large"
            >
              <AddFilterRotatableChevronButtonLabel
                variant="body1"
                component="span"
              >
                <RotatableChevron
                  rotated={isPopoverOpen}
                  color={palette.white}
                />
              </AddFilterRotatableChevronButtonLabel>
            </AddFilterRotatableChevronButtonWrapper>
          </Box>
        </BoxContainer>
        <FilterOptionsPopover
          anchorEl={popoverReference.current}
          open={isPopoverOpen}
          onClose={handleClose}
          filterOptionsList={menuOptions}
          onFilterSelect={handleClick}
        />
        {Object.keys(finalFilter).length > 0 && (
          <ClearFilter onClick={clearFilter}>Clear Filter</ClearFilter>
        )}
      </FilterButtonWrapper>
      <Divider />
      <BottomWrapper>
        {!isPopoverOpen && Object.keys(finalFilter).length === 0 && (
          <ClearFilterButton onClick={clearFilter}>
            <ClearFilterLabel>Clear Filters</ClearFilterLabel>
          </ClearFilterButton>
        )}
        {Object.keys(finalFilter).length > 0 && (
          <>
            <CancelButton
              disabled={Object.keys(finalFilter).length === 0}
              onClick={updateFilter}
              style={{ width: '270px' }}
            >
              {isUpdate ? 'Update Filter' : 'Save Filter'}
            </CancelButton>
            <ConfirmButton
              disabled={Object.keys(finalFilter).length === 0}
              style={{ width: '270px' }}
              onClick={handleApplyFinalFilter}
            >
              Apply Filter
            </ConfirmButton>
          </>
        )}
      </BottomWrapper>
    </>
  );
};

export default NewFilterContainer;
