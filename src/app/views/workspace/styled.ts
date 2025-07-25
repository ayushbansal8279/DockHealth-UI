import { fontWeights, fontSizes } from '@/app/styles/font';
import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import { MoreVert } from '@mui/icons-material';
import { Tab, TabProps } from '@mui/material';
import { Link } from 'react-router-dom';
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

export const WorkspaceTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MoreVertIcon = styled(MoreVert)`
  color: ${palette.coolGrey2};
  font-size: 26px;
  cursor: pointer;
`;

export const StyledListLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;