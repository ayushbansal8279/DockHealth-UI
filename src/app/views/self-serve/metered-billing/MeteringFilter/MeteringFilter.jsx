import {
  getMeteringEvents,
  getMeteringFilterOptions,
} from '@/app/api/metering-api';
import FilterButton from '@/app/components/filter/FilterButton/FilterButton';
import FilterPopover from '@/app/components/filter/FilterPopover/FilterPopover';
import NewFilterContainer from '@/app/components/filter/NewFilterContainer/NewFilterContainer';
import { organizationSelector } from '@/app/selectors/organization-selectors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertFilterToPayload } from './helper';

const MeteringFilter = ({ setBillingData, getInitialMeteringData }) => {
  const megaFilterButtonReference = useRef(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isOpen, openPopover] = useState(false);
  const [filters, setFilters] = useState({});
  const { organizationIdentifier } = useSelector(organizationSelector);
  const [finalFilter, setFinalFilter] = useState({});
  const [filteredData, setFilteredData] = useState({});

  const clearFilters = () => {
    getInitialMeteringData();
    setIsFilterApplied(false);
    setFinalFilter({});
  };

  useEffect(async () => {
    const filterOptions = await getMeteringFilterOptions();
    setFilters(filterOptions);
  }, []);

  const getFilteredMeteringData = async () => {
    const payload = convertFilterToPayload(
      filteredData,
      organizationIdentifier,
    );
    const result = await getMeteringEvents(payload);
    if (result) setBillingData(result);
    setIsFilterApplied(true);
  };

  const payload = {
    meteringEvent: {
      type: 'AI',
      subType: 'WORKFLOW_AI_SUMMARY_CREATED',
      organizationIdentifier: '160f8db5-40c2-11ea-a4e8-124feabd863a',
    },
    start: '2024-11-30T18:30:00.000Z',
    end: '2024-12-29T18:30:00.000Z',
  };

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
            handleSelectedFiltersChange={getFilteredMeteringData}
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
            multiSelectEnabled={false}
          />
        </div>
      </FilterPopover>
    </>
  );
};

export default MeteringFilter;
