import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import MenuIcon from 'img/menu-icon';
import * as TemplateActions from 'actions/template-actions';
import Spacing from 'components/common/Spacing';
import TaskCheckbox from 'components/task/TaskCheckbox';
import GlobalSearchInput from './GlobalSearchInput/GlobalSearchInput';
import {
  GlobalSearchWrapper,
  TopSectionGrid,
  InputWrapper,
  CheckboxDescription,
} from './styled';

const GlobalSearchView = ({ showNavbar }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchingCompletedTasks, setSearchingCompletedTasks] = useState(
    false,
  );
  const searchInputReference = useRef(null);

  return (
    <GlobalSearchWrapper>
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
            value={searchValue}
            onValueChange={setSearchValue}
            onClear={() => searchInputReference?.current?.focus()}
          />
        </InputWrapper>
        <Spacing horizontal={5} />
        <div>
          <TaskCheckbox
            size={22}
            onChange={event => {
              setSearchingCompletedTasks(event.target.checked);
            }}
            checked={isSearchingCompletedTasks}
          />
          <Spacing horizontal={3} />
          <CheckboxDescription>Search completed tasks</CheckboxDescription>
        </div>
      </TopSectionGrid>
      <div>Global search list</div>
    </GlobalSearchWrapper>
  );
};

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
};

export default connect(null, mapDispatchToProps)(GlobalSearchView);
