import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { Box, MenuItem, Select } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  BottomWrapper,
  FilterButtonWrapper,
  ClearFilter,
  Divider,
  BoxContainer,
  AddFilterButtonContainer,
  AddFilterRotatableChevronButtonWrapper,
  AddFilterRotatableChevronButtonLabel,
  AddFilterButtonLabel,
} from './styled';
import FilterSelect from '../FilterSelect/FilterSelect';
import { selectFilterOption } from 'helpers/filter-options-helpers';
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
  filteredData,
  setFilteredData,
  isQuickFilterEdit,
  setCustomFinalFilter,
  customFinalFilter,
  onClear,
  setSelectedQuickFilter,
}) => {
  const popoverReference = useRef(null);
  const [isPopoverOpen, openAddFilterPopover, closeAddFilterPopover] =
    useBoolean(false);

  useEffect(() => {
    const data = {};
    for (const key in finalFilter) {
      if (finalFilter[key].length > 0) {
        data[key] = { options: finalFilter[key].map((item) => item.key) };
      }
    }
    setFilteredData(data);
  }, [finalFilter]);

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
        isQuickFilterEdit
          ? setCustomFinalFilter((v) => ({ ...v, ...obs }))
          : setFinalFilter((v) => ({ ...v, ...obs }));
      }
    });
    closeAddFilterPopover();
  };

  const handleApplyFinalFilter = () => {
    onSelectedFiltersChange(selectFilterOption('', '', filteredData));
    openPopover(false);
  };

  const handleClose = useCallback(() => {
    closeAddFilterPopover();
  }, [closeAddFilterPopover]);

  const clearFilter = () => {
    setFinalFilter({});
    setCustomFinalFilter({});
    onClear();
    setSelectedQuickFilter('');
  };

  return (
    <>
      {Object.keys(isQuickFilterEdit ? customFinalFilter : finalFilter).map(
        (filter) => (
          <FilterSelect
            menuOptions={menuOptions}
            setFilter={
              isQuickFilterEdit ? setCustomFinalFilter : setFinalFilter
            }
            filter={filter}
            finalFilter={isQuickFilterEdit ? customFinalFilter : finalFilter}
            filterOptions={filters
              .flatMap((item) => item.id === filter && item.options)
              .filter((item) => typeof item !== 'boolean')}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
          />
        ),
      )}
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
        {Object.keys(isQuickFilterEdit ? customFinalFilter : finalFilter)
          .length > 0 && (
          <ClearFilter onClick={clearFilter}>Clear Filter</ClearFilter>
        )}
      </FilterButtonWrapper>
      {Object.keys(finalFilter).length > 0 && !isQuickFilterEdit && (
        <>
          <Divider />
          <BottomWrapper>
            <CancelButton
              disabled={Object.keys(finalFilter).length === 0}
              onClick={() => setSavePopupOpen(true)}
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
      )}
    </>
  );
};

export default NewFilterContainer;
