import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import { Popover, Link } from '@material-ui/core';

export const DashboardSidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Montserrat', sans-serif;
`;

export const TopSection = styled.div`
  position: relative;
  height: 90px;
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
  cursor: pointer;
  outline: none;
`;

export const ListItemsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ListItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-right: ${spacing.small};
`;

export const ListLink = styled(Link)`
  && {
    flex: 1;
    overflow: hidden;

    &:hover {
      text-decoration: none;
    }
  }
`;

export const ListItem = styled.div`
  position: relative;
  display: flex;
  padding: ${spacing.smallPlus} ${spacing.tiny} ${spacing.smallPlus} 42px;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const ListsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.smallPlus} ${spacing.smallPlus} ${spacing.smallPlus} 42px;
  color: ${palette.mediumGrey};
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
  border-radius: 4px;
  background-color: ${palette.brightBlue};
  position: absolute;
  left: 24px;
  top: 18px;
`;

export const PrivateListIcon = styled.img`
  position: absolute;
  left: 18px;
  top: 10px;
`;

export const RolloverPopover = styled(Popover)`
  && {
    pointer-events: none;
    transform: translateX(-${spacing.small});
  }
`;

export const RolloverPopoverLabel = styled.label`
  padding: 0 ${spacing.small};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  color: ${palette.brightBlue};
`;

export const MenuIconPlaceholder = styled.div`
  width: 29px;
`;

export const AddListButton = styled.button`
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  border-radius: 2px;
  color: ${palette.mediumGrey};
  padding: ${spacing.tiny} ${spacing.small};
  outline: none;

  & > span {
    color: ${palette.orange};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const NewListIndicator = styled.p`
  width: 210px;
  margin: ${spacing.giga} auto;
  padding: ${spacing.small} ${spacing.smallPlus};
  background: ${palette.darkBlue};
  color: ${palette.white};
  font-family: 'Roboto Condensed', sans-serif;
  text-align: center;
`;

export const NewListLabel = styled.p`
  position: absolute;
  top: -4px;
  left: 42px;
  margin-bottom: 0;
  color: ${palette.darkBlue};
  font-family: 'Roboto Condensed', sans-serif;
  text-transform: uppercase;
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.small};
`;
