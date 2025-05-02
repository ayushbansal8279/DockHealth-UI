import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getMeteringFilterOptions } from '@/app/api/metering-api';
import FilterButton from '@/app/components/filter/FilterButton/FilterButton';
import FilterPopover from '@/app/components/filter/FilterPopover/FilterPopover';
import NewFilterContainer from '@/app/components/filter/NewFilterContainer/NewFilterContainer';
import { determineDateOptions } from './helper';

const MeteringFilter = ({ onFilterChange }) => {
  const megaFilterButtonReference = useRef(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isOpen, openPopover] = useState(false);
  const [filters, setFilters] = useState({});
  const [finalFilter, setFinalFilter] = useState({});
  const [filteredData, setFilteredData] = useState({});

  const clearFilters = () => {
    setIsFilterApplied(false);
    setFinalFilter({});
    setFilteredData({});
    onFilterChange?.({});
  };

  const fetchFilterOptions = useCallback(async () => {
    const filterOptions = await getMeteringFilterOptions();
    setFilters(filterOptions);
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const getFilteredMeteringData = async () => {
    let filteredDataForPayload = filteredData;
    if (
      !(
        filteredData?.eventTypes?.options?.length > 0 ||
        filteredData?.eventSubTypes?.options?.length > 0
      )
    ) {
      filteredDataForPayload = {
        ...filteredData,
        eventTypes: {
          options: ['AUTOMATION', 'EHR', 'API'],
        },
      };
    }

    if (
      !filteredDataForPayload.eventDateOptions.dateStart ||
      !filteredDataForPayload.eventDateOptions.dateEnd
    ) {
      filteredDataForPayload = determineDateOptions(filteredDataForPayload);
    }

    setIsFilterApplied(true);
    onFilterChange?.(filteredDataForPayload);
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
            setFilteredData={setFilteredData}
            filteredData={filteredData}
            isSaveDisabled
          />
        </div>
      </FilterPopover>
    </>
  );
};

export default MeteringFilter;
