import { Grid, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import { themeMontserratNormal } from 'styles/theme-montserrat';
import Loader, { LoaderSizes } from './Loader/Loader';

const GenericHeaderContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  padding-right: 0.5rem;
  width: 100%;
`;

const DockHeaderImage = styled.img.attrs({
  alt: 'Dock Health',
  src: DockHeaderLogo,
})`
  height: auto;
  object-fit: contain;
`;

const DefaultHeaderTypographyComponent = props => (
  <Typography variant="h4" {...props} />
);

const GenericHeader = ({
  children,
  isFetching = false,
  useTypography = true,
}) => {
  const ChildrenWrapperComponent = useTypography
    ? DefaultHeaderTypographyComponent
    : React.Fragment;

  return (
    <ThemeProvider theme={themeMontserratNormal}>
      <GenericHeaderContainer>
        <Grid container alignItems="center">
          <ChildrenWrapperComponent>
            {isFetching ? <Loader size={LoaderSizes.medium} /> : children}
          </ChildrenWrapperComponent>
        </Grid>
        <Link to="/">
          <DockHeaderImage />
        </Link>
      </GenericHeaderContainer>
    </ThemeProvider>
  );
};

GenericHeader.propTypes = {
  children: PropTypes.node,
  isFetching: PropTypes.bool,
};

GenericHeader.defaultProps = {
  children: '',
  isFetching: false,
};

export default GenericHeader;
