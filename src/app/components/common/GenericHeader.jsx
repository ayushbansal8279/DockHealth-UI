import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import CubesLoader from './CubesLoader';

const StyledAppBar = styled(AppBar)`
  && {
    background: #fff;
    border-bottom: 1px solid #e4e4e4;
    box-sizing: content-box;
    height: 88px;
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    padding: 5px 38px 8px 48px;
    height: 100%;
  }
`;

const StyledTitle = styled(Typography)`
  && {
    font-size: 22px;
    line-height: 49px;
    color: #303538;
  }
`;

const GenericHeader = ({ children, isFetching }) => (
  <StyledAppBar position="sticky" color="default" elevation={0}>
    <StyledToolbar>
      {isFetching ? (
        <Grid container alignItems="center">
          <CubesLoader size={32} />
        </Grid>
      ) : (
        <>
          <div style={{ flex: 0.35 }}>
            <StyledTitle variant="h5">{children}</StyledTitle>
          </div>
        </>
      )}
    </StyledToolbar>
  </StyledAppBar>
);

GenericHeader.propTypes = {
  children: PropTypes.node,
  isFetching: PropTypes.bool,
};

GenericHeader.defaultProps = {
  children: '',
  isFetching: false,
};

export default GenericHeader;
