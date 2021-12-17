/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { HOME_PATH } from 'routing/helpers/paths';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import ActivityAlerts from 'components/activity-alerts/ActivityAlerts';
import TrialBanner from 'components/navigation/TrialBanner/TrialBanner';
import {
  HeaderContainer,
  MainHeader,
  DockHeaderImage,
  Title,
  Description,
} from './styled';

const LayoutHeader = props => {
  const { children } = props;

  return (
    <HeaderContainer>
      <MainHeader>
        <Box
          display="flex"
          flex="1 0 0"
          justifyContent="space-between"
          alignItems="center"
          overflow="hidden"
        >
          {children}
        </Box>
        <Box mx={1} />
        <ActivityAlerts />
        <Box mx={1} />
        <Link to={HOME_PATH}>
          <DockHeaderImage />
        </Link>
      </MainHeader>
      <TrialBanner />
    </HeaderContainer>
  );
};

LayoutHeader.Title = props => {
  const { title, description } = props;

  return (
    <Box flex={1} overflow="hidden">
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Box>
  );
};

LayoutHeader.Spacer = () => <Box mx={1} />;

export default LayoutHeader;
