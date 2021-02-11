import { Grid, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { themeMontserratNormal } from 'styles/theme-montserrat';
import ActivityAlerts from 'components/activity-alerts/ActivityAlerts';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import {
  AlertsLogoContainer,
  DockHeaderImage,
  GenericHeaderContainer,
} from './styled';

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
        <AlertsLogoContainer>
          <ActivityAlerts />
          <Link to="/core/home/my-tasks">
            <DockHeaderImage />
          </Link>
        </AlertsLogoContainer>
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
