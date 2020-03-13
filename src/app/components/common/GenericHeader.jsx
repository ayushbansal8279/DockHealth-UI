import { Grid, ThemeProvider } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { themeMontserratNormal } from '../../theme-montserrat';
import CubesLoader from './CubesLoader';

const GenericHeaderContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 4rem;
  grid-gap: 1rem;
  padding-right: 0.5rem;
  width: 100%;
`;

const GenericHeader = ({ children, isFetching = false }) => (
  <ThemeProvider theme={themeMontserratNormal}>
    <GenericHeaderContainer>
      <Grid container alignItems="center">
        {isFetching ? <CubesLoader size={32} color="#fff" /> : children}
      </Grid>
      <Link to="/">
        <img src="/assets/img/dock-logo-mini.svg" alt="Dock Health" />
      </Link>
    </GenericHeaderContainer>
  </ThemeProvider>
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
