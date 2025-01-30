
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from '@/app/styles/spacing';

export const Title = styled.h2`
  margin: 0;
  font-size: ${fontSizes.regularPlus};
  color: ${palette.offBlack};
  font-family: Outfit;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  gap: 8px;
  font-weight: ${fontWeights.regularPlus};
  line-height: 25px;
  text-transform: capitalize;
  flex: 1;
`;
export const Container = styled.div`
  height: 380px;
  width: 384px;
  overflow-y: auto; /* Allow vertical scrolling */
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;
`;

export const ListsWrapper = styled.div`
  flex: 1;
  width: 100%;
  max-height: 330px; /* Limit height */
  min-height: 330px;
  border: 1px solid ${palette.coolGrey2};
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
`;
export const ListItem = styled.div`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end; ;
  align-items: center;
  appearance: none;
  border-radius: 0;
  background-color: ${({ isSelected }) =>
    isSelected ? palette.brightBlueWithAlpha : 'transparent'};

  &:hover {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;
export const ListItemTextButton = styled.button`
  flex: 1;
  margin: 0;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  font-size: ${fontSizes.regular};
  text-align: left;
  outline: none;
  cursor: ${({ isSelected }) => (isSelected ? 'initial' : 'pointer')};
  justifyContent: 'space-between';

`;

export const EmptyMessage = styled.p`
  color: ${palette.coolGrey2};
  margin-top: ${spacing.huge};
  text-align: center;
`;

export const HeaderSearchWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 8px;
  pointer-events: auto;
  z-index: 1010; 
`;

// export const Container = styled.div`
//   height: 384px;
//   width: 384px;
//   overflow: hidden;
// `;

export const WorkflowFoldersListContainer = styled.div`
  width: 100%;
  ::-webkit-scrollbar-track {
    background-color: white;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${palette.coolGrey3};
    border-radius: 17px;
  }
`;

export const WorkflowFoldersContainer = styled.div`
  width: 317px;
  // height: 273px;
`;

export const PopoverHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  // border-bottom: 1px solid ${palette.coolGrey3};
`;

export const BackIconContainer = styled.div`
  display: flex;
  padding-right: 1px;
  padding-left: 10px;
  vertical-align: middle;
  justify-content: center;
  cursor: pointer;
`;

export const HeaderTextContainer = styled.div`
  font-weight: ${fontWeights.regularPlus};
  margin-top: 8px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 19.07px;
  letter-spacing: 0px;
  text-align: left;
`;

export const TitleWithButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  
  & > button {
    position: absolute;  /* Fix the button to the left */
    left: ${spacing.mega};
    top: ${spacing.mega};
    color: ${palette.brightBlue};
    cursor: pointer;
  }
`;

export const FolderIconContainer = styled.div`
  display: flex;
  width: 26px;
  justify-content: center;
  margin-left: ${spacing.smallPlus};
  grid-column: 1;
`;