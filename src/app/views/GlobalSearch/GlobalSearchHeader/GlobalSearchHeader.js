import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { isSearchingCompletedTasksSelector } from 'selectors/global-search-selectors';
import { GlobalSearchSagaActions } from 'sagas/global-search-saga';
import * as TemplateActions from 'actions/template-actions';
import Spacing from 'components/common/Spacing';
import TaskCheckbox from 'components/task/TaskCheckbox';
import GlobalSearchInput from '../GlobalSearchInput/GlobalSearchInput';

import { TopSectionGrid, InputWrapper, CheckboxDescription } from './styled';

const GlobalSearchHeader = ({
  isSearchingCompletedTasks,
  setSearchValue,
  setSearchCompletedTasks,
  clearSearchValue,
}) => {
  const searchInputReference = useRef(null);

  const search = value => {
    setSearchValue(value);
  };

  return (
    <TopSectionGrid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <InputWrapper>
        <GlobalSearchInput
          ref={searchInputReference}
          onValueChange={search}
          onClear={() =>
            clearSearchValue() && searchInputReference?.current?.focus()
          }
        />
      </InputWrapper>
      <Spacing horizontal={5} />
      <div>
        <TaskCheckbox
          size={22}
          onChange={event => setSearchCompletedTasks(event.target.checked)}
          checked={isSearchingCompletedTasks}
        />
        <Spacing horizontal={3} />
        <CheckboxDescription>Search completed tasks</CheckboxDescription>
      </div>
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
