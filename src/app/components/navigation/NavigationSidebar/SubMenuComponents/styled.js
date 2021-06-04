import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Popover } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

export const SubmenuHeader = styled.h3`
  margin: 0;
  padding: ${spacing.smallPlus};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.coolGrey1};
`;

export const SubmenuDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border-color: ${palette.coolGrey3};
`;

export const SubMenuLink = styled(Link)`
  display: block;
  width: 100%;
  padding: ${spacing.small};
  text-align: left;
  color: ${palette.coolGrey1};
  transition: all 0.3s ease-out;

  &:hover {
    color: ${palette.mediumGrey};
  }
`;

export const BlueSubMenuLink = styled(SubMenuLink)`
  color: ${palette.brightBlue};

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const DrawerItemOptions = styled.div`
  display: flex;
  align-items: center;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};
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

export const SpacingContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Profile submenu
export const ProfileSubmenuContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: ${spacing.regular} 0;
`;

export const ReferButton = styled.button`
  padding: ${spacing.tiny} ${spacing.regularPlus};
  background: ${palette.brightBlue};
  color: ${palette.white};
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.regular};
  border-radius: 22px;
  cursor: pointer;
`;

export const Top = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserName = styled.p`
  flex: 1;
  margin-bottom: 0;
  font-weight: ${fontWeights.bold};
  overflow: hidden;
`;

export const Title = styled.p`
  width: 100%;
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
`;

export const BeforeIcon = styled(NavigateBeforeIcon)`
  && {
    color: ${palette.mediumGrey};
    cursor: pointer;
  }
`;

const IMAGE_SIZE = 140;

export const UserImage = styled.img`
  width: ${IMAGE_SIZE}px;
  height: ${IMAGE_SIZE}px;
`;

export const UserInitialCircle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${IMAGE_SIZE}px;
  height: ${IMAGE_SIZE}px;
  border-radius: ${IMAGE_SIZE / 2}px;
  background-color: ${({ color }) => color || palette.coolGrey2};
  font-family: 'Montserrant', sans-serif;
  font-size: ${IMAGE_SIZE / 40}rem;
  font-weight: ${fontWeights.bold};
  color: ${palette.white};
  text-transform: lowercase;

  &:after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: ${IMAGE_SIZE - 10}px;
    height: ${IMAGE_SIZE - 10}px;
    border: 5px solid ${palette.white};
    border-radius: ${(IMAGE_SIZE - 10) / 2}px;
  }
`;

// Organization submenu
export const MyOrganizationLabel = styled.h2`
  flex: 1;
  margin: 0;
  padding: ${spacing.smallPlus};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.mediumGrey};
  word-break: break-all;
  white-space: initial;
`;

export const DrawerOrganizationsList = styled.div`
  padding: ${spacing.large} ${spacing.smallPlus} ${spacing.small};
  border-bottom: 1px solid ${palette.coolGrey2};
`;

// Lists
export const DrawerListsList = styled.div`
  padding: ${spacing.largePlus} 0 ${spacing.largePlus} ${spacing.smallPlus};
  border-bottom: 1px solid ${palette.coolGrey2};
  overflow-y: auto;
`;

export const DrawerListsItem = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  margin-bottom: 10px;
`;

export const DrawerListsItemNewLabel = styled.div`
  position: absolute;
  top: -4px;
  left: 0;
  color: ${palette.brightBlue};
  font-size: 10px;
  font-weight: 400;
  font-family: Roboto Condensed;
`;

export const DrawerListsNewLabel = styled.div`
  color: white;
  background-color: ${palette.midnightBlue};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  padding: 10px 18px;
  margin-top: ${spacing.smallExtraPlus};
`;

export const ListNameText = styled.div`
  flex: 1;
  padding-right: ${spacing.small};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ isActive }) =>
    isActive
      ? `color: ${palette.brightBlue};`
      : `
          &:hover {
            color: ${palette.brightBlue};
            text-decoration: underline;
            cursor: pointer;
          }
        `}
`;

export const UpdatesForMemberIndicator = styled.div`
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: ${palette.brightBlue};
`;

// Education Center
export const EducationCenterWrapper = styled.div`
  display: flex;
  padding: 0 ${spacing.small};
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  white-space: initial;
`;

export const EducationCenterFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto 1fr;
  grid-template-rows: auto auto;
  grid-gap: ${spacing.small};
  align-items: center;
  width: 100%;
  padding: ${spacing.smallPlus};
  color: ${palette.darkGrey};
`;

export const FooterIcon = styled.div`
  grid-column: 2;
  grid-row: 1;
`;

export const FooterInfoText = styled.p`
  grid-row: 1;
  grid-column: 3;
  margin: 0;
  text-align: center;
  line-height: 16px;
`;

export const FooterLink = styled.a`
  grid-row: 2;
  grid-column: 3;
  margin: 0;
  line-height: 16px;
  text-align: center;
  color: ${palette.brightBlue};
`;

export const EducationCenterTitle = styled.h3`
  margin: 0;
  padding: ${spacing.smallPlus} 0;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.brightBlue};
`;

export const EducationCenterList = styled.div`
  position: relative;
  flex: 1 0 0;
  width: 100%;
  overflow-y: auto;
  color: ${palette.darkGrey};
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: ${fontWeights.light};
`;

export const CategoryName = styled.p`
  display: block;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2;
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.light};
  background: ${palette.white};
`;

export const EducationItem = styled.div`
  padding: ${spacing.small};
  border: 1px solid ${palette.coolGrey3};
  background: ${palette.coolGrey4};

  &:not(:last-of-type) {
    margin-bottom: ${spacing.smallPlus};
  }
`;

export const EducationItemHeaderButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const EducationItemName = styled.p`
  display: block;
  flex: 1;
  margin: 0;
  font-size: ${fontSizes.regular};
  text-align: left;
`;

export const EducationOverviewText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
`;

export const EducationItemOverview = styled.p`
  margin: 0;
  font-size: ${fontSizes.smallPlus};
`;
