import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filterOptionsSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'ramda/src/isEmpty';
import * as PatientsActions from 'actions/patients-actions';
import { organizationSelector } from 'selectors/organization-selectors';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import { Box } from '@mui/material';
import FilterTable from 'components/filter/FilterTable/FilterTable';
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

const PatientsFilter = ({ closeFilter, filterButtonReference }) => {
  const [menuOptions, setMenuOption] = useState([]);
  const [finalFilter, setFinalFilter] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [editIdentifier, setEditIdentifier] = useState('');
  const [customFinalFilter, setCustomFinalFilter] = useState({});
  const [selectedCustomFilter, setSelectedCustomFilter] = useState({});
  const [customFilteredData, setCustomFilteredData] = useState({});
  const dispatch = useDispatch();
  const filterOptions = useSelector(filterOptionsSelector);
  const selectedFilters = useSelector(patientsSelectedFiltersSelector);
  const isFilterApplied = selectedFilters && !isEmpty(selectedFilters);

  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);

  const { organizationIdentifier } = useSelector(organizationSelector);

  useEffect(() => {
    setMenuOption(
      filterOptions?.map((item) => ({ label: item.label, id: item.id })),
    );
  }, [filterOptions, finalFilter]);

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
    (name,filteredData) =>
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
        // onSelectedFiltersChange={onSelectFilters}
        setFinalFilter={setFinalFilter}
        setMenuOption={setMenuOption}
        menuOptions={menuOptions}
        // openPopover={openPopover}
        handleSaveQuickFilter={handleSaveQuickFilter}
        // setFilteredData={setFilteredData}
        filteredData={filteredData}
        customFinalFilter={customFinalFilter}
        selectedCustomFilter={selectedCustomFilter}
        setCustomFinalFilter={setCustomFinalFilter}
        // selectedQuickFilter={selectedQuickFilter}
        // setSelectedQuickFilter={setSelectedQuickFilter}
        customFilteredData={customFilteredData}
        setCustomFilteredData={setCustomFilteredData}
        // selectQuickFilter={selectQuickFilter}
        isPatientListPage
        
      ></SaveFilterPopup>
      <CustomFilters
        quickFiltersList={quickFiltersList}
        addQuickFilterOption={addQuickFilterOption}
        selectedQuickFilter={selectedQuickFilter}
        selectQuickFilter={handleSelectQuickFilter}
        editModeEnabled={false}
        // onCreate={handleQuickFilterCreate}
        onUpdate={handleQuickFilterUpdate}
        onDelete={handleQuickFilterDelete}
        setSavePopupOpen={setSavePopupOpen}
        // selectQuickFilter={selectQuickFilter}
        // onUpdate={onQuickFilterUpdate}
        // editModeEnabled={wasChangedFilters}
        onQuickFilterCreate={handleQuickFilterCreate}
        // onDelete={onQuickFilterDelete}
        // setMenuOption={setMenuOption}
        // setFinalFilter={setFinalFilter}
        filters={filterOptions}
        setEditIdentifier={setEditIdentifier}
        editIdentifier={editIdentifier}
        customFinalFilter={customFinalFilter}
        setCustomFinalFilter={setCustomFinalFilter}
        // openPopover={openPopover}
        // selectedQuickFilter={selectedQuickFilter}
        // setSelectedQuickFilter={setSelectedQuickFilter}
        // clearFilters={clearFilters}
        setSelectedCustomFilter={setSelectedCustomFilter}
        handleQuickFilterDuplicateForPatientList={handleQuickFilterDuplicateForPatientList}
        isPatientListPage
      />
      <NewFilterContainer
        filters={filterOptions}
        // onSelectedFiltersChange={onSelectFilters}
        setFinalFilter={setFinalFilter}
        finalFilter={finalFilter}
        setMenuOption={setMenuOption}
        menuOptions={menuOptions}
        // openPopover={openPopover}
        quickFiltersList={quickFiltersList}
        setSavePopupOpen={setSavePopupOpen}
        // onQuickFilterCreate={onQuickFilterCreate}
        // handleSaveQuickFilter={handleSaveQuickFilter}
        setFilteredData={setFilteredData}
        // filteredData={filteredData}
        customFinalFilter={customFinalFilter}
        setCustomFinalFilter={setCustomFinalFilter}
        // setSelectedQuickFilter={setSelectedQuickFilter}
        handleSelectedFiltersChange={handleSelectedFiltersChange}
        isPatientListPage
      ></NewFilterContainer>
      {/* <FilterHeader
        title="Filter patients"
        filterActive={isFilterApplied}
        selectedFilters={selectedFilters}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClear={handleClear}
        onSave={handleSaveQuickFilter}
        onSaveAsNew={handleSaveAsQuickFilter}
        selectedQuickFilter={selectedQuickFilter}
        editModeEnabled={wasChangedFilters}
      />
      <Box p={2} />
      <FilterTable
        searchValue={searchValue}
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={handleSelectedFiltersChange}
      >
        <CustomFilters
          quickFiltersList={quickFiltersList}
          addQuickFilterOption={addQuickFilterOption}
          selectedQuickFilter={selectedQuickFilter}
          selectQuickFilter={handleSelectQuickFilter}
          editModeEnabled={false}
          onCreate={handleQuickFilterCreate}
          onUpdate={handleQuickFilterUpdate}
          onDelete={handleQuickFilterDelete}
        />
      </FilterTable> */}
    </>
  );
};

export default PatientsFilter;
