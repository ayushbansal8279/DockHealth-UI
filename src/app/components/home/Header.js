import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Members from './Members';

const StyledAppBar = styled(AppBar)`
  && {
    border-bottom: 1px solid #e4e4e4;
    background: #fff;
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    padding: 5px 38px 8px 48px;
  }
`;

const StyledTitle = styled(Typography)`
  && {
    font-size: 36px;
    line-height: 49px;
    color:#303538;
  }
`;

const StyledSubtitle = styled(Typography)`
  && {
    font-size: 16px;
    line-height: 26px;
    color: #2e3a43;
    margin-left: 2px; /* visually align with StyledTitle */
  }
`;

const nbsp = '\u00A0'; // Used to preserve line height when there's no subtitle

const Header = ({
  title, taskCount, members, isFetching,
}) => (
  <StyledAppBar position="sticky" color="default" elevation={0}>
    <StyledToolbar>
      <div style={{ flexGrow: 1 }}>
        <StyledTitle variant="h5">{title}</StyledTitle>
        <StyledSubtitle variant="subtitle1">{isFetching ? nbsp : `${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}`}</StyledSubtitle>
      </div>
      {members && <Members members={members} onClick={() => {}} />}
    </StyledToolbar>
  </StyledAppBar>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  taskCount: PropTypes.number.isRequired,
  members: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
    initials: PropTypes.string,
  })),
  isFetching: PropTypes.bool,
};

Header.defaultProps = {
  isFetching: false,
  members: null, // doesn't show add button
};

export default Header;
