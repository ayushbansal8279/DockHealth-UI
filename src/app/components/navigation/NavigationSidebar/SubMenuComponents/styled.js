import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Popover } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import Skeleton from '@mui/material/Skeleton';
import prop from 'ramda/src/prop';
import { ArrowForwardIos, MoreVert, ArrowBack } from '@mui/icons-material';

export const ColorIndicator = styled.span`
  display: block;
  background-color: ${prop('color')};
  width: 11.5px;
  height: 11.5px;
`;

export const SubmenuDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border-color: ${palette.coolGrey3};
`;

export const SubmenuHeader = styled.h3`
  margin: 0;
  padding: ${spacing.smallPlus};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  color: ${palette.coolGrey1};
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

export const MenuLink = styled(SubMenuLink)`
  color: ${palette.mediumGrey};
  padding: 0;
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

export const UpgradePlanContainer = styled.div`
  display: flex;
  padding: ${spacing.regular} ${spacing.smallPlus};
  justify-content: center;
`;

export const DrawerSubmenuLabel = styled.div`
  color: ${palette.coolGrey1};
  font-weight: ${fontWeights.bold};
`;

export const DrawerAddLink = styled(Link)`
  color: ${palette.coolGrey1};
  outline: none;
  border: none;
  background-color: ${palette.coolGrey4};
  border-radius: 9px;
  font-weight: ${fontWeights.bold};
  padding: ${spacing.tiny} 10px;

  & > span {
    color: ${palette.orange};
  }

  &:hover {
    cursor: pointer;
  }
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
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Outfit', sans-serif;
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
  font-family: inherit;
  color: ${palette.mediumGrey};
  word-break: break-all;
  white-space: initial;
`;

// Organization submenu
export const DrawerOrganizationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 6px 0;

  & > div {
    word-break: break-all;
  }
`;

export const DrawerOrganizationLabel = styled.div`
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.bold};
  white-space: normal;
`;

export const DrawerMyOrganizationLabel = styled(DrawerSubmenuLabel)`
  color: ${palette.coolGrey1};
  font-weight: ${fontWeights.bold};
  padding: ${spacing.giga} ${spacing.smallPlus} ${spacing.smallPlus};
  border-bottom: 1px solid ${palette.coolGrey2};
  font-size: ${fontSizes.smallPlus};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DrawerOrganizationsList = styled.div`
  padding: ${spacing.large} ${spacing.smallPlus} ${spacing.small};
  border-bottom: 1px solid ${palette.coolGrey2};
  overflow: auto;
`;

// Lists
export const DrawerMyListsLabel = styled(DrawerSubmenuLabel)`
  color: ${({ $isSubMenu }) =>
    $isSubMenu ? palette.black : palette.coolGrey1};
  font-weight: ${({ $isSubMenu }) =>
    $isSubMenu ? fontWeights.light : fontWeights.bold};
  padding: ${({ $isSubMenu, $isOpen }) =>
    $isSubMenu
      ? $isOpen
        ? `0 ${spacing.smallPlus} ${spacing.smallPlus} ${spacing.smallPlus}`
        : `0 ${spacing.smallPlus} `
      : spacing.smallPlus};
  border-bottom: ${({ $isSubMenu }) =>
    $isSubMenu ? '' : `1px solid ${palette.coolGrey2}`};
  font-size: ${({ $isSubMenu }) =>
    $isSubMenu ? fontSizes.regular : fontSizes.smallPlus};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Outfit;
  line-height: 18px;
  text-align: left;
`;

export const DrawerListsList = styled.div`
  padding: ${({ $isSubMenu, $isOpen }) =>
    $isSubMenu
      ? $isOpen
        ? `${spacing.small}  0 ${spacing.regularPlus} 0`
        : `${spacing.small}  0 ${spacing.small} 0`
      : `${spacing.largePlus} 0`};
  border-bottom: ${({ $isSubMenu, $isOpen }) =>
    $isSubMenu
      ? $isOpen
        ? `1px solid ${palette.whiteSmoke}`
        : ''
      : `1px solid ${palette.coolGrey2}`};
  overflow-y: auto;

  ${({ flexShrink }) =>
    flexShrink !== undefined && `flex-shrink: ${flexShrink}`}
`;

export const DrawerListsItem = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  box-sizing: border-box;
  border: 1px solid transparent;
  ${({ $isSubMenu }) =>
    $isSubMenu
      ? `padding: 5px 0`
      : `&:not(:last-child) {
        padding-bottom: 10px;
      }`};

  ${({ $isDragging }) =>
    $isDragging &&
    ` border-bottom:2px solid ${palette.black};
  `};

  ${({ $isDraggable }) =>
    $isDraggable &&
    `
        &:hover {
          // border: 1px solid ${palette.coolGrey2};
          background: ${palette.whiteSmoke};
        }

        &:hover {
          & ${MenuWrapper} {
            opacity: 1;                  
          }
        }
      `}
`;

export const DrawerListsItemLoader = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 24px;
      margin-bottom: 10px;
    }
  }
`;

export const DrawerListsItemNewLabel = styled.div`
  position: absolute;
  top: -8px;
  left: 24;
  color: ${palette.brightBlue};
  font-size: 10px;
  font-weight: 400;
  font-family: inherit;
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
  ${({ color }) => (color ? `color: ${color};` : undefined)}
  ${({ isActive, $isSubMenu }) =>
    isActive
      ? `
        color: ${palette.brightBlue};
      `
      : `
          cursor: pointer;
        ${
          !$isSubMenu
            ? `&:hover {
          color: ${palette.brightBlue};
          text-decoration: underline;
        }`
            : ''
        }  
        `};
`;

export const ListNameLabel = styled.div`
  font-family: Outfit;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  font-weight: ${({ isNewList }) => (isNewList ? '700' : '400')};
`;

export const UpdatesForMemberIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
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
  padding: ${spacing.smallPlus} 0;
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
  font-family: inherit;
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
  font-family: inherit;
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

export const EducationOverviewText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
`;

export const EducationItemLink = styled.a`
  font-size: ${fontSizes.smallPlus};
  color: ${palette.brightBlue};
`;

export const EducationItemTourButton = styled.button`
  padding: ${spacing.tiny} ${spacing.small};
  font-size: ${fontSizes.smallPlus};
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;

export const EducationItemOverview = styled.p`
  margin: 0;
  font-size: ${fontSizes.smallPlus};
`;

export const EducationSearchInput = styled.input`
  flex: 1;
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  border: none;
  outline: none;
`;

export const Version = styled.p`
  color: ${palette.darkGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
`;

export const MenuWrapper = styled.div`
  opacity: 0;
`;

export const WorkspacesTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.smallExtraPlus} ${spacing.small};
`;

export const WorkspacesSubWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.smallPlus};
`;

export const WorkspacesTitle = styled.div`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regular};
`;

export const WorkspaceSettingsIcon = styled.img`
  cursor: pointer;
`;

export const AddworkspaceButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 80px;
  border-radius: ${spacing.tiny};
  color: ${palette.white};
  background-color: ${palette.newDarkBlue};
  height: 35px;
  gap: 1px;
  padding-right: ${spacing.small};
`;

export const WorkspaceWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;

export const WorkspaceTitle = styled.div`
  font-size: 18px;
  font-weight: ${fontWeights.light};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const WorkspaceSubWrapper = styled.div`
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  cursor: pointer;
`;

export const MoreVertIcon = styled(MoreVert)`
  color: ${palette.coolGrey2};
  font-size: 26px;|
  cursor: pointer;
`;

export const ArrowForwardIcon = styled(ArrowForwardIos)`
  font-size: 20px;
  margin-right: 10px;
`;

export const ArrowBackIcon = styled(ArrowBack)`
  cursor: pointer;
`;

export const Spacing = styled.div`
  margin-bottom: 15px;
`;

export const WorkspaceListWrapper = styled.div`
  margin-top: 20px;
`;

export const WorkspaceItemWrapper = styled.div`
  margin-top: 10px;
`;

export const WorkspaceContainer = styled.div`
  height: 100%;
  overflow: hidden;
`;

export const WorkspaceListItems = styled.div`
  max-height: 65vh;
  overflow-y: auto;
  border-bottom: 1px solid ${palette.coolGrey2};
  padding: ${spacing.regular} 0 ${spacing.regular} 0;
`;

export const WorkspaceUserItems = styled.div`
  max-height: 65vh;
  overflow-y: auto;
  border-bottom: 1px solid ${palette.coolGrey2};
  padding: ${spacing.regular} 0 ${spacing.regular} ${spacing.regular};
`;
