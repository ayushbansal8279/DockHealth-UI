import React, { useCallback, useEffect, useMemo } from 'react';
import {
  filterOptionsSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'ramda/src/isEmpty';
import * as PatientsActions from 'actions/patients-actions';
import { organizationSelector } from 'selectors/organization-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  getQuickFilters,
  createQuickFilter,
  deleteQuickFilter,
  selectQuickFilter,
  showAddQuickFilterOption,
  updateQuickFilter,
  quickContextTypes,
} from 'actions/mega-filter-actions';
import CustomFilters from 'components/filter/CustomFilters/CustomFilters';
import equals from 'ramda/src/equals';
import {
  addQuickFilterOptionSelector,
  quickFiltersSelector,
  selectedQuickFilterSelector,
} from 'selectors/mega-filter-selectors';
import NewFilterContainer from '../../filter/NewFilterContainer/NewFilterContainer';
import SaveFilterPopup from '../../filter/SaveFilterPopup/SaveFilterPopup';

const PatientsFilter = ({
  closeFilter,
  filterButtonReference,
  finalFilter,
  setFinalFilter,
  filteredData,
  setFilteredData,
  isSavePopupOpen,
  setSavePopupOpen,
  editIdentifier,
  setEditIdentifier,
  customFinalFilter,
  setCustomFinalFilter,
  selectedCustomFilter,
  setSelectedCustomFilter,
  customFilteredData,
  setCustomFilteredData,
}) => {
  const dispatch = useDispatch();
  const filterOptions = useSelector(filterOptionsSelector);
  const selectedFilters = useSelector(patientsSelectedFiltersSelector);
  // const isFilterApplied = selectedFilters && !isEmpty(selectedFilters);

  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);

  const { organizationIdentifier } = useSelector(organizationSelector);

  const userProfile = useSelector(userProfileSelector);
  const isAdmin = checkIfUserIsOrganizationAdmin(userProfile);

  useEffect(() => {
    if (!filterOptions || filterOptions?.length === 0) {
      dispatch(PatientsActions.getCurrentPatientsListFilterOptions());
    }
    dispatch(
      getQuickFilters({
        organizationIdentifier,
        contextType: quickContextTypes.PATIENTS,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const data = {};
    if (selectedQuickFilter === null && selectedFilters && filterOptions) {
      for (const key in selectedFilters) {
        if (key !== '') {
          const users = filterOptions
            .flatMap((item) => item.id === key && item.options)
            .filter((item) => typeof item !== 'boolean');

          let options = selectedFilters[key].options.map((item) => {
            if (item.includes('DATE_RANGE')) {
              let aa = users.find((user) => user.key === item);
              aa = {
                ...aa,
                dateStart: selectedFilters[key].dateStart,
                dateEnd: selectedFilters[key].dateEnd,
              };
              return aa;
            } else {
              return users.find((user) => user.key === item);
            }
          });
          data[key] = options;
        }
      }
      setFinalFilter(data);
    }
  }, [selectedFilters, filterOptions, selectedQuickFilter]);

  const handleSelectedFiltersChange = () => {
    dispatch(PatientsActions.setPatientsSelectedFilters(filteredData));
    closeFilter();
  };

  const handleClear = () => {
    dispatch(PatientsActions.clearPatientsFilters());
    dispatch(selectQuickFilter(null));
  };

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleSaveQuickFilter = useCallback(
    (quickFilterIdentifier, selectedFilters) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          {
            selectedOptions: selectedFilters,
          },
          { organizationIdentifier, contextType: quickContextTypes.PATIENTS },
        ),
      ),
    [dispatch, organizationIdentifier, selectedFilters, selectedQuickFilter],
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      // dispatch(selectQuickFilter(id));
      // dispatch(filterListDetailsTasks(filtersSetup));
      dispatch(selectQuickFilter(id));
      dispatch(PatientsActions.setPatientsSelectedFilters(filtersSetup));
    },
    [dispatch],
  );

  const handleQuickFilterCreate = useCallback(
    (name, filteredData) =>
      dispatch(
        createQuickFilter(
          name,
          { organizationIdentifier, contextType: quickContextTypes.PATIENTS },
          filteredData,
        ),
      ),
    [dispatch, organizationIdentifier, selectedFilters],
  );

  const handleQuickFilterDuplicateForPatientList = useCallback(
    (name, updatedFilters) =>
      dispatch(
        createQuickFilter(
          name,
          { organizationIdentifier, contextType: quickContextTypes.PATIENTS },
          updatedFilters,
        ),
      ),
    [dispatch, organizationIdentifier, selectedFilters],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(updateQuickFilter(quickFilterIdentifier, { name })),
    [dispatch],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList?.find(
          (f) => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  return (
    <>
      <SaveFilterPopup
        refrence={filterButtonReference}
        isSavePopupOpen={isSavePopupOpen}
        setSavePopupOpen={setSavePopupOpen}
        finalFilter={finalFilter}
        quickFiltersList={quickFiltersList}
        onQuickFilterCreate={handleQuickFilterCreate}
        onQuickFilterUpdate={handleQuickFilterUpdate}
        setEditIdentifier={setEditIdentifier}
        editIdentifier={editIdentifier}
        filters={filterOptions}
        setFinalFilter={setFinalFilter}
        handleSaveQuickFilter={handleSaveQuickFilter}
        filteredData={filteredData}
        customFinalFilter={customFinalFilter}
        selectedCustomFilter={selectedCustomFilter}
        setCustomFinalFilter={setCustomFinalFilter}
        customFilteredData={customFilteredData}
        setCustomFilteredData={setCustomFilteredData}
        isPatientListPage
      />
      <CustomFilters
        quickFiltersList={quickFiltersList}
        addQuickFilterOption={addQuickFilterOption}
        selectedQuickFilter={selectedQuickFilter}
        selectQuickFilter={handleSelectQuickFilter}
        editModeEnabled={isAdmin}
        onUpdate={handleQuickFilterUpdate}
        onDelete={handleQuickFilterDelete}
        setSavePopupOpen={setSavePopupOpen}
        onQuickFilterCreate={handleQuickFilterCreate}
        filters={filterOptions}
        setEditIdentifier={setEditIdentifier}
        editIdentifier={editIdentifier}
        customFinalFilter={customFinalFilter}
        setCustomFinalFilter={setCustomFinalFilter}
        setSelectedCustomFilter={setSelectedCustomFilter}
        handleQuickFilterDuplicateForPatientList={
          handleQuickFilterDuplicateForPatientList
        }
        clearFilters={handleClear}
        isPatientListPage
      />
      <NewFilterContainer
        filters={filterOptions}
        setFinalFilter={setFinalFilter}
        finalFilter={finalFilter}
        quickFiltersList={quickFiltersList}
        setSavePopupOpen={setSavePopupOpen}
        setFilteredData={setFilteredData}
        customFinalFilter={customFinalFilter}
        setCustomFinalFilter={setCustomFinalFilter}
        handleSelectedFiltersChange={handleSelectedFiltersChange}
        isPatientListPage
        editModeEnabled={isAdmin}
      />
    </>
  );
};

export default PatientsFilter;
