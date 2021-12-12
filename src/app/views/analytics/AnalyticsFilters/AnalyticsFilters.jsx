import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { capitalize } from 'helpers/capitalize';
import * as AnalyticsActions from 'actions/analytics-actions';
import FilterTableLoader from 'components/filter/FilterTableLoader/FilterTableLoader';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterOptionByCategory from 'components/filter/FilterOptionByCategory/FilterOptionByCategory';
import SearchableFilterOptions from 'components/filter/SearchableFilterOptions/SearchableFilterOptions';
import {
  analyticsFiltersSelector,
  analyticsSelectedFiltersSelector,
} from 'selectors/analytics-selectors';

const AnalyticsFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(analyticsFiltersSelector);
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(AnalyticsActions.getAnalyticsFilterOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = useCallback(
    (categoryId, optionId) => {
      if (selectedFilters?.[categoryId]?.includes(optionId)) {
        dispatch(
          AnalyticsActions.unselectAnalyticsFilter(categoryId, optionId),
        );
      } else {
        dispatch(AnalyticsActions.selectAnalyticsFilter(categoryId, optionId));
      }
    },
    [dispatch, selectedFilters],
  );

  return (
    <>
      <FilterHeader
        title="Filter"
        filterActive={!!selectedFilters}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClear={() => dispatch(AnalyticsActions.clearAnalyticsFilter())}
      />
      <Box p={2} />
      <FilterScrollableRow>
        {filters ? (
          filters.map(({ id, label, options }) => (
            <FilterOptionsColumn key={id} label={capitalize(label)}>
              <SearchableFilterOptions
                selectedFilterOptions={selectedFilters?.[id]}
                filterOptions={options}
                searchValue={searchValue}
                renderOption={({
                  key: optionId,
                  selected,
                  displayValue,
                  count,
                  reference,
                }) => (
                  <FilterOptionByCategory
                    key={optionId}
                    categoryId={id}
                    id={optionId}
                    selected={selected}
                    displayValue={displayValue}
                    count={count}
                    reference={reference}
                    onSelect={handleOptionClick}
                  />
                )}
              />
            </FilterOptionsColumn>
          ))
        ) : (
          <FilterTableLoader />
        )}
      </FilterScrollableRow>
    </>
  );
};

export default AnalyticsFilters;
