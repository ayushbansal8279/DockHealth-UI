/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useSelector } from 'react-redux';
import { HOME_PATH } from 'routing/helpers/paths';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import ActivityAlerts from 'components/activity-alerts/ActivityAlerts';
import { UserOrganizationRole } from 'helpers/user-helper';
import TrialBanner from 'components/navigation/TrialBanner/TrialBanner';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import { patientDetailsStateSelector } from 'selectors/patient-details-selectors';
import {
  HeaderContainer,
  MainHeader,
  DockHeaderImage,
  Title,
  Description,
  ColorIndicator,
} from './styled';

const { ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE, EXTERNAL } =
  UserOrganizationRole;

const LayoutHeader = (props) => {
  const { children, horizontalSticky } = props;
  const location = useLocation();
  const isIframe =
    window.self !== window.top && location.pathname.includes('/core/patient');

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const whiteLabelEnabled = currentOrganization?.whiteLabelEnabled || false;

  const patientDetails = useSelector(patientDetailsStateSelector);

  return (
    <HeaderContainer horizontalSticky={horizontalSticky}>
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
        <AccessRestrictor
          allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE, EXTERNAL]}
        >
          {!isIframe && (
            <ActivityAlerts
              patientIdentifier={patientDetails?.patientIdentifier}
            />
          )}
        </AccessRestrictor>
        <Box mx={1} />
        {!whiteLabelEnabled && (
          <Link to={isIframe ? location.pathname : HOME_PATH}>
            <DockHeaderImage />
          </Link>
        )}
      </MainHeader>
      <TrialBanner />
    </HeaderContainer>
  );
};

LayoutHeader.Title = (props) => {
  const { title, description, colorIndicator, children } = props;

  return (
    <Box flex={1} overflow="hidden">
      <Title>
        <Box display="flex" alignItems="center">
          {colorIndicator && (
            <Box ml="10px" mr="16px">
              <ColorIndicator color={colorIndicator} />
            </Box>
          )}
          <Box overflow="hidden">{title}</Box>
          {children}
        </Box>
      </Title>
      <Description>{description}</Description>
    </Box>
  );
};

LayoutHeader.Spacer = () => <Box mx={1} />;

export default LayoutHeader;
