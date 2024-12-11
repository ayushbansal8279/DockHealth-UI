import { Box } from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import { userProfileSelector } from 'selectors/user-selectors';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalizeWords } from 'helpers/capitalize';
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
  FilterCount,
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
import debounce from 'lodash.debounce';
import { getFilteredCountsForList } from '@/app/api/list-details-api';
import {
  currentTaskListSelector,
  currentTaskListTasksStatusSelector,
} from '@/app/selectors/task-list-selectors';

const NewFilterContainer = ({
  filters,
  finalFilter,
  setFinalFilter,
  openPopover,
  setSavePopupOpen,
  filteredData,
  setFilteredData,
  isQuickFilterEdit,
  setSelectedQuickFilter,
  handleSelectedFiltersChange,
  editModeEnabled = true,
  fiterCount,
  setFilterCount,
  showFiterCount = false,
}) => {
  const popoverReference = useRef(null);
  const [isPopoverOpen, openAddFilterPopover, closeAddFilterPopover] =
    useBoolean(false);
  const [isDisable, setDisable] = useState(false);

  const currentUser = useSelector(userProfileSelector);
  const taskList = useSelector(currentTaskListSelector);
  const taskListStatus = useSelector(currentTaskListTasksStatusSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelMixedCase = capitalizeWords(customerTypeLabel);
  const sanitizedFilters = filters?.map((item) => {
    return item?.id.toLowerCase() === 'patients'
      ? { ...item, label: customerTypeLabelMixedCase }
      : item;
  });

  const processedData = useMemo(() => {
    const data = {};
    let hasItems = false;
    for (const key in finalFilter) {
      if (finalFilter[key]?.length > 0) {
        hasItems = true;
        const options = [];
        let dateStart = '';
        let dateEnd = '';
        finalFilter[key].forEach((item) => {
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
            ? { options, dateStart, dateEnd }
            : { options };
      }
    }
    setDisable(hasItems);
    return data;
  }, [finalFilter]);

  const fetchfilterCountWithDebounce = useCallback(
    debounce(async (value) => {
      const count = await getFilteredCountsForList(
        taskList?.taskListIdentifier,
        taskListStatus,
        value,
      );
      setFilterCount(count?.count);
    }, 50),
    [taskList?.taskListIdentifier, taskListStatus],
  );

  useEffect(() => {
    setFilteredData(processedData);
    if (showFiterCount) {
      if (Object.entries(processedData)?.length > 0) {
        fetchfilterCountWithDebounce(processedData);
      } else {
        setFilterCount(-1);
      }
    }
  }, [processedData, showFiterCount, fetchfilterCountWithDebounce]);

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
    handleSelectedFiltersChange();
    openPopover(false);
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
          key={filter}
          filters={sanitizedFilters}
          setFinalFilter={setFinalFilter}
          filter={filter}
          finalFilter={finalFilter}
          filterOptions={sanitizedFilters
            ?.flatMap((item) => item?.id === filter && item?.options)
            ?.filter((item) => typeof item !== 'boolean')}
          setFilteredData={setFilteredData}
          filteredData={filteredData}
        />
      ))}
      {fiterCount !== -1 && (
        <FilterCount> {fiterCount} matching result</FilterCount>
      )}
      {editModeEnabled && (
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
            filterOptionsList={sanitizedFilters}
            onFilterSelect={handleClick}
          />
          {Object.keys(finalFilter).length > 0 && (
            <ClearFilter onClick={clearFilter}>Clear Selection</ClearFilter>
          )}
        </FilterButtonWrapper>
      )}
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
