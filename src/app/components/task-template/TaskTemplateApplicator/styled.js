import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Skeleton from '@mui/material/Skeleton';

export const FolderIconContainer = styled.div`
  display: flex;
  width: 26px;
  justify-content: center;
  margin-left: ${spacing.small};
  grid-column: 1;
`;

export const PopoverHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  border-bottom: 1px solid ${palette.coolGrey3};
  padding: 4px;
`;

export const BackIconContainer = styled.div`
  display: flex;
  padding: 4px;
  padding-right: 20px;
  padding-left: 10px;
  vertical-align: middle;
  justify-content: center;
  cursor: pointer;
`;
export const HeaderTextContainer = styled.div`
  font-weight: ${fontWeights.regularPlus};
`;

export const FolderIcon = styled.img`
  grid-column: 1;
`;

export const SearchContainer = styled.div`
  border-bottom: 1px solid ${palette.coolGrey3};
`;

export const SelectOptionsContainer = styled.div`
  max-height: 400;
  overflow: auto;
`;

export const TaskTemplateApplicatorContainer = styled.div`
  display: flex;
  width: 170px;
  padding: ${spacing.small} 0 ${spacing.tiny} ${spacing.regular};
  background-color: white;
  border: 1px solid ${palette.coolGrey3};
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.smallPlus};
  color: ${palette.mediumGrey};

  @media print {
    display: none;
  }
`;

export const TaskTemplateApplicatorLabel = styled.span`
  white-space: nowrap;
  cursor: pointer;
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
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
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
  width: 100%;
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
