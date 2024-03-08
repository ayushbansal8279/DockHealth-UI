import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Skeleton from '@mui/material/Skeleton';
import { Typography } from '@mui/material';

export const FolderIconContainer = styled.div`
  display: flex;
  width: 26px;
  justify-content: center;
  // margin-left: ${spacing.small};
  grid-column: 1;
`;

export const FolderNameContainer = styled(Typography)`
  // font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;
`;
export const WorkflowNameContainer = styled(Typography)`
  // font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;
`;

export const PopoverHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  // border-bottom: 1px solid ${palette.coolGrey3};
  padding: 4px;
`;

export const BackIconContainer = styled.div`
  display: flex;
  // padding: 4px;
  padding-right: 1px;
  padding-left: 10px;
  vertical-align: middle;
  justify-content: center;
  cursor: pointer;
`;
export const HeaderTextContainer = styled.div`
  font-weight: ${fontWeights.regularPlus};
  margin-top: 8px;
  // font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;
`;

export const FolderIcon = styled.img`
  grid-column: 1;
`;

export const SearchContainer = styled.div`
  // border-bottom: 1px solid
  //   ${({ isWorkFlowSearch }) =>
    isWorkFlowSearch ? palette.lightGrayishBlue : palette.coolGrey3};
`;

export const WorkflowFoldersContainer = styled.div`
  width: 317px;
  // height: 273px;
`;

export const WorkflowListsContainer = styled.div`
  width: 317px;
  // height: 240px;
  // overflow: hidden;
`;

export const WorkflowLists = styled.div`
  width: 317px;
  max-height: 432;
  overflow-y: auto;
  scrollbar-width: thin;
  // scrollbar-radius: 17px;
  scrollbar-button: none;
`;

export const WorkflowFoldersHeaderContainer = styled.div`
  width: 317px;
  height: 33px;
  padding: 7px 16px 7px 16px;
  gap: 10px;
`;

export const WorkflowFoldersListContainer = styled.div`
  width: 317px;
  max-height: 240;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
  // scrollbar-radius: 17px;
`;

export const WorkflowFoldersHeaderLabel = styled(Typography)`
  width: 50px;
  height: 19px;
  // font-family: Open;
  font-weight: 600;
  font-size: 14px;
  line-height: 19.07px;
`;

export const WorkflowSearchHorizontalLineContainer = styled.div`
  width: 317px;
  height: 16px;
  padding: 8px 0px 8px 0px;
  gap: 10px;
`;
export const WorkflowSearchHorizontalLine = styled.div`
  width: 317px;
  border: 1px solid #d4d9df;
`;

export const SelectOptionsContainer = styled.div`
  // max-height: 400;
  // overflow: auto;
`;

export const TaskTemplateApplicatorContainer = styled.div`
  display: flex;
  padding: ${spacing.small} 0 7px ${spacing.regular};
  background-color: ${palette.newDarkBlue};
  border: 1px solid ${palette.coolGrey3};
  font-size: ${fontSizes.smallPlus};
  color: ${palette.white};
  height: 40px;
  border-radius: 5px;

  :hover {
    background-color: ${palette.purpleNavy};
  }

  @media print {
    display: none;
  }
`;

export const TaskTemplateApplicatorLabel = styled.div`
  white-space: nowrap;
  cursor: pointer;
  font-size: ${fontSizes.regular};
  font-family: 'Outfit', sans-serif;
  color: ${palette.white};
  font-weight: ${fontWeights.light};
  display: inline-block;
  margin-left: ${spacing.tiny};
  margin-right: ${spacing.tiny};
  text-transform: none;
`;

export const ChevronVerticleGap = styled.div`
  background-color: ${palette.white};
  height: 40px;
  margin-top: -8px;
  width: 2px;
  content: &nbsp;
`;

export const CreateTaskLinkText = styled.span`
  color: ${palette.mediumGrey};

  &:before {
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }
`;

export const CreateTaskLinkContainer = styled.div`
  background-color: ${palette.coolGrey4};
  padding: 8px 20px 8px 32px;
  position: relative;
`;

export const Item = styled.div`
  width: 100%;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  text-align: left;
  cursor: pointer;
  color: ${({ color }) => color || palette.mediumGrey};
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const EmptyLabel = styled.div`
  padding: ${spacing.regular} ${spacing.large};
  color: ${palette.mediumGrey};
`;

export const LoaderItem = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      margin: ${`${spacing.regular} ${spacing.large}`};
    }
  }
`;

export const LoaderContainer = styled.div`
  padding: ${spacing.smallPlus} 0;
`;

export const ListItemTextButton = styled.button`
  flex: 1;
  margin: 0;
  padding: ${spacing.smallPlus} ${spacing.small};
  font-size: ${fontSizes.regular};
  text-align: left;
  outline: none;
  cursor: ${({ isSelected }) => (isSelected ? 'initial' : 'pointer')};
`;

export const NextArrow = styled(ChevronRightIcon)`
  color: ${palette.lightGrey};
  cursor: pointer;
`;

export const ListItem = styled.div`
  display: block;
  width: 299px;
  height: 48px;
  padding: 0px 8px 0px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  appearance: none;
  border-radius: 0;
  background-color: ${({ isSelected }) =>
    isSelected ? palette.darkBlue : 'transparent'};

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? palette.darkBlue : palette.brightBlueWithAlpha};
  }

  & ${ListItemTextButton} {
    color: ${({ isSelected }) =>
      isSelected ? palette.white : palette.darkGrey};
  }

  & ${NextArrow} {
    color: ${({ isSelected }) =>
      isSelected ? palette.white : palette.lightGrey};
  }
`;
