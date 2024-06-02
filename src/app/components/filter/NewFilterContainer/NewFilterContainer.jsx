import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { selectFilterOption } from 'helpers/filter-options-helpers';
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
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import RotatableChevron from '../../common/RotatableChevron/RotatableChevron';
import palette from '@/app/styles/palette';
import useBoolean from '@/app/hooks/useBoolean';
import FilterOptionsPopover from './FilterOptionsPopover';

const NewFilterContainer = ({
  filters,
  onSelectedFiltersChange,
  finalFilter,
  setFinalFilter,
  openPopover,
  setSavePopupOpen,
  handleSaveQuickFilter,
  filteredData,
  setFilteredData,
  isQuickFilterEdit,
  setSelectedQuickFilter,
  handleSelectedFiltersChange,
  isPatientListPage,
}) => {
  const popoverReference = useRef(null);
  const [isPopoverOpen, openAddFilterPopover, closeAddFilterPopover] =
    useBoolean(false);
  const [isDisable, setDisable] = useState(false);

  useEffect(() => {
    const data = {};
    for (const key in finalFilter) {
      if (finalFilter[key].length > 0) {
        setDisable(true);
        const options = [];
        let dateStart = '';
        let dateEnd = '';
        finalFilter[key].map((item) => {
          if (item?.key?.includes('DATE_RANGE')) {
            dateStart = item?.dateStart;
            dateEnd = item?.dateEnd;
            options.push(item?.key);
          } else {
            options.push(item?.key || '');
          }
        });
        data[key] =
          dateStart !== '' && dateEnd !== ''
            ? {
                options,
                dateStart,
                dateEnd,
              }
            : { options };
      } else {
        setDisable(false);
      }
    }
    setFilteredData(data);
  }, [finalFilter]);

  const handleClick = (option) => {
    filters.map((item) => {
      if (
        option === item?.id &&
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
    onSelectedFiltersChange(selectFilterOption('', '', filteredData));
    openPopover(false);
  };

  const handleApplyFinalFilterPatient = () => {
    handleSelectedFiltersChange();
  };

  const handleClose = useCallback(() => {
    closeAddFilterPopover();
  }, [closeAddFilterPopover]);

  const clearFilter = () => {
    setFinalFilter({});
    setSelectedQuickFilter('');
  };

  return (
    <>
      {Object.keys(finalFilter).map((filter) => (
        <FilterSelect
          filters={filters}
          setFinalFilter={setFinalFilter}
          filter={filter}
          finalFilter={finalFilter}
          filterOptions={filters
            .flatMap((item) => item?.id === filter && item?.options)
            .filter((item) => typeof item !== 'boolean')}
          setFilteredData={setFilteredData}
          filteredData={filteredData}
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
          filterOptionsList={filters}
          onFilterSelect={handleClick}
        />
        {Object.keys(finalFilter).length > 0 && (
          <ClearFilter onClick={clearFilter}>Clear Selection</ClearFilter>
        )}
      </FilterButtonWrapper>
      {Object.keys(finalFilter).length > 0 && !isQuickFilterEdit && (
        <>
          <Divider />
          <BottomWrapper>
            <CancelButton
              disabled={!isDisable}
              onClick={() => setSavePopupOpen(true)}
              style={{ width: '270px' }}
            >
              Save Filter
            </CancelButton>
            <ConfirmButton
              disabled={!isDisable}
              style={{ width: '270px' }}
              onClick={
                isPatientListPage
                  ? handleApplyFinalFilterPatient
                  : handleApplyFinalFilter
              }
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
