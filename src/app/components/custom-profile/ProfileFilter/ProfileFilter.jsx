import { useCallback, useEffect, useRef, useState } from 'react';
import FilterButton from '../../filter/FilterButton/FilterButton';
import FilterPopover from '../../filter/FilterPopover/FilterPopover';
import NewFilterContainer from '@/app/components/filter/NewFilterContainer/NewFilterContainer';
import {
  getProfileDetailByFilter,
  getProfileFilterOptions,
} from '@/app/api/profile-api';
import { convertToPayload } from './helper';

const ProfileFilter = ({
  profileTypeIdentifier,
  fetchProfiles,
  setProfiles,
}) => {
  const megaFilterButtonReference = useRef(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isOpen, openPopover] = useState(false);
  const [filters, setFilters] = useState({});
  const [finalFilter, setFinalFilter] = useState({});
  const [filteredData, setFilteredData] = useState({});

  const clearFilters = useCallback(() => {
    setIsFilterApplied(false);
    setFinalFilter({});
    fetchProfiles();
  }, [setIsFilterApplied, setFinalFilter, fetchProfiles]);

  const fetchFilterOptions = useCallback(async () => {
    const filterOptions = await getProfileFilterOptions(profileTypeIdentifier);
    setFilters(filterOptions);
  }, [profileTypeIdentifier, setFilters]);

  const handleApplySelectedFilter = useCallback(async () => {
    const payload = convertToPayload(filteredData);
    setIsFilterApplied(true);
    const result = await getProfileDetailByFilter(
      profileTypeIdentifier,
      payload,
    );
    setProfiles(result);
  }, [filteredData, profileTypeIdentifier, setIsFilterApplied, setProfiles]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return (
    <>
      <FilterButton
        ref={megaFilterButtonReference}
        active={isFilterApplied}
        onClick={() => openPopover(!isOpen)}
        onClear={clearFilters}
        isOpen={isOpen}
      />
      <FilterPopover
        anchorEl={megaFilterButtonReference.current}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <div style={{ marginBottom: '10px' }}>
          <NewFilterContainer
            filters={filters}
            handleSelectedFiltersChange={handleApplySelectedFilter}
            setFinalFilter={setFinalFilter}
            finalFilter={finalFilter}
            openPopover={openPopover}
            // quickFiltersList={quickFiltersList}
            // setSavePopupOpen={setSavePopupOpen}
            // onQuickFilterCreate={onQuickFilterCreate}
            // handleSaveQuickFilter={handleSaveQuickFilter}
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            // customFinalFilter={customFinalFilter}
            // setCustomFinalFilter={setCustomFinalFilter}
            // setSelectedQuickFilter={setSelectedQuickFilter}
            isSaveDisabled
          />
        </div>
      </FilterPopover>
    </>
  );
};

export default ProfileFilter;
