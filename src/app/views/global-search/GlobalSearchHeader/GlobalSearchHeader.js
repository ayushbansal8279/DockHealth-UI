import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { isSearchingCompletedTasksSelector } from 'selectors/global-search-selectors';
import { GlobalSearchSagaActions } from 'sagas/global-search-saga';
import * as TemplateActions from 'actions/template-actions';
import Spacing from 'components/common/Spacing';
import Checkbox from 'components/common/Checkbox/Checkbox';
import SearchInput from 'components/common/SearchInput/SearchInput';
import { useHistory } from 'react-router-dom';

import {
  TopSectionGrid,
  InputWrapper,
  CheckboxDescription,
  CheckboxContainer,
} from './styled';

const GlobalSearchHeader = ({
  isSearchingCompletedTasks,
  setSearchValue,
  setSearchCompletedTasks,
  clearSearchValue,
}) => {
  const searchInputReference = useRef(null);
  const history = useHistory();

  const search = value => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (window.location.href) {
      const queryValues = queryString.parse(history?.location?.search);
      if (queryValues.criteria !== undefined) {
        setSearchValue(queryValues.criteria);
        searchInputReference.current.value = queryValues.criteria;
      }
      if (
        queryValues.completed !== undefined &&
        queryValues.completed === 'true'
      ) {
        setSearchCompletedTasks(true);
      }
    }
  }, [searchInputReference, history, setSearchValue, setSearchCompletedTasks]);

  return (
    <TopSectionGrid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <InputWrapper>
        <SearchInput
          ref={searchInputReference}
          onValueChange={search}
          onClear={() =>
            clearSearchValue() && searchInputReference?.current?.focus()
          }
        />
      </InputWrapper>
      <Spacing horizontal={5} />
      <CheckboxContainer>
        <Checkbox
          size={16}
          onClick={() => setSearchCompletedTasks(!isSearchingCompletedTasks)}
          isChecked={isSearchingCompletedTasks}
        />
        <Spacing horizontal={3} />
        <CheckboxDescription>Search completed tasks</CheckboxDescription>
      </CheckboxContainer>
    </TopSectionGrid>
  );
};

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
  setSearchValue: GlobalSearchSagaActions.setSearchValue,
  setSearchCompletedTasks: GlobalSearchSagaActions.setSearchCompletedTasks,
  clearSearchValue: GlobalSearchSagaActions.clearSearchValue,
};

const mapStateToProps = store => ({
  isSearchingCompletedTasks: isSearchingCompletedTasksSelector(store),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchHeader);
