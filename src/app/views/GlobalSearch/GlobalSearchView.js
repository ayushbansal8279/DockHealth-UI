import React from 'react';
import { connect } from 'react-redux';
import MenuIcon from 'img/menu-icon';
import * as TemplateActions from 'actions/template-actions';
import Spacing from 'components/common/Spacing';
import { GlobalSearchWrapper, TopSectionGrid } from './styled';

const GlobalSearchView = ({ showNavbar }) => {
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
      </TopSectionGrid>
      <div>Global search list</div>
    </GlobalSearchWrapper>
  );
};

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
};

export default connect(null, mapDispatchToProps)(GlobalSearchView);
