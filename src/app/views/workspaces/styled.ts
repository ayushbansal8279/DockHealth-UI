import { fontWeights, fontSizes } from '@/app/styles/font';
import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import { Tab, TabProps } from '@mui/material';
import styled from 'styled-components';

interface MainTabProps extends TabProps {
  $isActive?: boolean;
}

export const MainTab = styled(Tab)<MainTabProps>`
  && {
    text-transform: none;
    font-weight: ${({ $isActive }) =>
      $isActive ? fontWeights.regularPlus : fontWeights.regular};
    font-size: ${fontSizes.regularPlus};
    color: ${palette.offBlack};
  }
`;

export const WorkspaceTabsContainer = styled.div`
  padding: 0 ${spacing.huge};
  background-color: ${palette.white};
`;

export const WorkspaceDetailsContainer = styled.div`
  min-height: 100vh;
`;
