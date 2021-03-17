import styled from 'styled-components';
import spacing from 'styles/spacing';
import { MontserratTypography } from 'styles/theme-montserrat';

export const HeaderTextContainer = styled.div`
  flex: 1;
  margin-top: ${spacing.small};
  overflow: hidden;
`;

export const HeaderLogo = styled.img`
  width: 110px;
`;

export const HeaderTitle = styled(MontserratTypography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DashboardHeaderActivityAlertsContainer = styled.div`
  margin-right: 24px;
`;
