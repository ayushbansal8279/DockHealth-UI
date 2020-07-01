import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import MenuIcon from 'img/menu-icon';
import { isSearchingCompletedTasksSelector } from 'selectors/global-search-selectors';
import * as GlobalSearchSagaActions from 'sagas/global-search-saga';
import * as TemplateActions from 'actions/template-actions';
import Spacing from 'components/common/Spacing';
import TaskCheckbox from 'components/task/TaskCheckbox';
import GlobalSearchInput from '../GlobalSearchInput/GlobalSearchInput';

import { TopSectionGrid, InputWrapper, CheckboxDescription } from './styled';

const GlobalSearchHeader = ({
  showNavbar,
  isSearchingCompletedTasks,
  setSearchValue,
  setSearchCompletedTasks,
}) => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const searchInputReference = useRef(null);

  const search = value => {
    setSearchInputValue(value);
    setSearchValue(value);
  };

  return (
    <TopSectionGrid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <button type="button" onClick={showNavbar}>
        <img src={MenuIcon} alt="menu" />
      </button>
      <Spacing horizontal={5} />
      <InputWrapper>
        <GlobalSearchInput
          ref={searchInputReference}
          value={searchInputValue}
          onValueChange={search}
          onClear={() => searchInputReference?.current?.focus()}
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
};

const mapStateToProps = store => ({
  isSearchingCompletedTasks: isSearchingCompletedTasksSelector(store),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchHeader);
