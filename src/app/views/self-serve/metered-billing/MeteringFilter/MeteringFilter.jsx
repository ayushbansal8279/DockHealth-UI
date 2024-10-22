import FilterButton from '@/app/components/filter/FilterButton/FilterButton';
import FilterPopover from '@/app/components/filter/FilterPopover/FilterPopover';
import { useCallback, useRef, useState } from 'react';

const MeteringFilter = () => {
  const megaFilterButtonReference = useRef(null);
  const isFilterApplied = false;
  const [isOpen, openPopover] = useState(false);
  const clearFilters = useCallback(() => {}, []);
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
        <div>Hiiii</div>
      </FilterPopover>
    </>
  );
};

export default MeteringFilter;
