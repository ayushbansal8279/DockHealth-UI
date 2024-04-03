import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import {
  isSearchingCompletedTasksSelector,
  searchValueSelector,
} from 'selectors/global-search-selectors';
import { GlobalSearchSagaActions } from 'sagas/global-search-saga';
import * as TemplateActions from 'actions/template-actions';
import Spacing from 'components/common/Spacing';
import Checkbox from 'components/common/Checkbox/Checkbox';
import SearchInput from 'components/common/SearchInput/SearchInput';
import { useHistory } from 'react-router-dom';

import {
  TopSectionGrid,
  InputWrapper,
  ButtonWrapper,
  CheckboxDescription,
  CheckboxContainer,
} from './styled';

const GlobalSearchHeader = ({
  isSearchingCompletedTasks,
  searchValue,
  setSearchValue,
  setSearchCompletedTasks,
  searchTasks,
}) => {
  const history = useHistory();

  useEffect(() => {
    if (window.location.href) {
      const queryValues = queryString.parse(history?.location?.search);
      if (queryValues.criteria !== undefined) {
        setSearchValue(queryValues.criteria);
      }
      if (
        queryValues.completed !== undefined &&
        queryValues.completed === 'true'
      ) {
        setSearchCompletedTasks(true);
      }
    }
  }, [history, setSearchValue, setSearchCompletedTasks]);

  return (
    <TopSectionGrid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <InputWrapper>
        <SearchInput
          value={searchValue}
          onValueChange={setSearchValue}
          onKeyEnter={searchTasks}
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
      <ButtonWrapper onClick={searchTasks}>
        Search
      </ButtonWrapper>
    </TopSectionGrid>
  );
};

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
  setSearchValue: GlobalSearchSagaActions.setSearchValue,
  setSearchCompletedTasks: GlobalSearchSagaActions.setSearchCompletedTasks,
  searchTasks: GlobalSearchSagaActions.searchTasks,
};

const mapStateToProps = (store) => ({
  searchValue: searchValueSelector(store),
  isSearchingCompletedTasks: isSearchingCompletedTasksSelector(store),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchHeader);
