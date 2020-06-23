import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

export const DashboardSidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Montserrat', sans-serif;
`;

export const TopSection = styled.div`
  position: relative;
  height: 180px;
  width: 100%;
`;

export const ListsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const MenuButton = styled.button`
  position: absolute;
  left: 42px;
  top: 60px;
`;

export const ListItemsWrapper = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

export const ListItem = styled.div`
  position: relative;
  display: flex;
  padding: ${spacing.small} ${spacing.large} ${spacing.small} 42px;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const ListsHeader = styled(ListItem)`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regularPlus};
`;

export const ListItemTitle = styled.div`
  display: block;
  flex: 1;
  overflow: hidden;
`;

export const TitleText = styled.p`
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ListItemInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${spacing.small};
`;

export const InfoDot = styled.div`
  height: 8px;
  width: 8px;
  margin-right: ${spacing.small};
  border-radius: 4px;
  background-color: ${palette.brightBlue};
`;

export const PrivateListIcon = styled.img`
  position: absolute;
  left: 18px;
  top: 10px;
`;
