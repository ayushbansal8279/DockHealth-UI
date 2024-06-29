/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cleanClickFilter } from 'actions/mega-filter-actions';
import { useDispatch } from 'react-redux';
import compose from 'ramda/src/compose';
import CustomFilterOption from '../CustomFilterOption/CustomFilterOption';
import { CustomFiltersContainer, Label, OptionsList } from './styled';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import sessionStorageHelper from '@/app/helpers/session-storage-helper';

const CustomFilters = ({
  quickFiltersList = [],
  addQuickFilterOption,
  selectQuickFilter: setSelected,
  onCreate,
  onUpdate,
  onDelete,
  editModeEnabled = true,
  setFinalFilter,
  filters,
  setSavePopupOpen,
  setEditIdentifier,
  setCustomFinalFilter,
  openPopover,
  onQuickFilterCreate,
  setSelectedQuickFilter,
  selectedQuickFilter,
  clearFilters,
  setSelectedCustomFilter,
  isPatientListPage,
  handleQuickFilterDuplicateForPatientList,
  origin,
  selectedDashboardQuickfilters,
  setSelectedDashboardQuickfilters,
}) => {
  const [editModeFilterIdentifier, setEditModeFilterIdentifier] =
    useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const unlisten = history.listen(compose(dispatch, cleanClickFilter));

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = useCallback(
    (_, identifier, { selectedOptions }) => {
      if (origin === TaskOrigin.DASHBOARD) {
        const quickFiltersList = selectedDashboardQuickfilters || [];
        if (!quickFiltersList?.includes(identifier)) {
          quickFiltersList.push(identifier);
        }
        sessionStorageHelper.setItem(
          'dashboardSelectedQuickFilters',
          JSON.stringify(quickFiltersList),
        );
        // ToDo @Nitin we can call the API and pass the quickFiltersList here
        setSelectedDashboardQuickfilters(quickFiltersList);
        openPopover(false);
      } else {
        setSelected(identifier, selectedOptions);
        setSelectedQuickFilter(identifier);
      }
    },
    [
      openPopover,
      setSelected,
      setSelectedQuickFilter,
      selectedDashboardQuickfilters,
      setSelectedDashboardQuickfilters,
    ],
  );

  const handleUpdate = useCallback(
    (identifier, name) => {
      setEditModeFilterIdentifier(null);
      if (typeof onUpdate === 'function') onUpdate(identifier, name);
    },
    [onUpdate],
  );

  const handleCreate = useCallback(
    (_, name) => {
      setEditModeFilterIdentifier(null);
      if (typeof onCreate === 'function') onCreate(name);
    },
    [onCreate],
  );

  if (
    (!quickFiltersList || quickFiltersList.length === 0) &&
    !addQuickFilterOption
  )
    return null;

  return (
    <CustomFiltersContainer>
      <Label>Quick Filters</Label>
      <OptionsList>
        {quickFiltersList.map((filter) => (
          <CustomFilterOption
            filters={filters}
            filter={filter}
            label={filter.name}
            key={filter.quickFilterIdentifier}
            identifier={filter.quickFilterIdentifier}
            selectedQuickFilter={selectedQuickFilter}
            setSelectedQuickFilter={setSelectedQuickFilter}
            onOptionClick={(event) =>
              handleSelect(event, filter.quickFilterIdentifier, filter)
            }
            onEditMode={(identifier) => setEditModeFilterIdentifier(identifier)}
            disabled={filter.quickFilterIdentifier !== editModeFilterIdentifier}
            disableOptions={filter.predefined}
            onBlur={handleUpdate}
            editModeEnabled={editModeEnabled}
            onDelete={onDelete}
            setSavePopupOpen={setSavePopupOpen}
            setFinalFilter={setFinalFilter}
            setEditIdentifier={setEditIdentifier}
            setCustomFinalFilter={setCustomFinalFilter}
            onQuickFilterCreate={onQuickFilterCreate}
            clearFilters={clearFilters}
            setSelectedCustomFilter={setSelectedCustomFilter}
            isPatientListPage={isPatientListPage}
            handleQuickFilterDuplicateForPatientList={
              handleQuickFilterDuplicateForPatientList
            }
            origin={origin}
            selectedDashboardQuickfilters={selectedDashboardQuickfilters}
            setSelectedDashboardQuickfilters={setSelectedDashboardQuickfilters}
            openPopover={openPopover}
          />
        ))}
      </OptionsList>
    </CustomFiltersContainer>
  );
};

export default CustomFilters;
