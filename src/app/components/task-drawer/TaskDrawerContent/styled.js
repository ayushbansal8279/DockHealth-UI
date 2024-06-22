import styled from 'styled-components';
import palette from 'styles/palette';
import { Divider } from '@mui/material';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const TaskDrawerContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  text-align: left;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  background-color: ${palette.white};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const TaskDrawerBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100%;
  z-index: -1;
`;

export const rowHeight = 'fit-content';

export const styleTaskDrawerContainer = {
  // padding: '1rem 0rem 0.5rem  0rem',
  width: '100%',
};

export const styleFullRow = (isMobile) => ({
  padding: isMobile ? '0.5rem 1rem' : '0.5rem 2rem',
  height: rowHeight,
});

export const styleFullRowThin = (isMobile) => ({
  padding: isMobile ? '0rem 1rem' : '0rem 2rem',
  height: rowHeight,
});

export const styleFirstRow = (isMobile) => ({
  padding: isMobile ? '0rem 1rem 0.5rem 1rem' : '0rem 2rem 0.5rem 2rem',
});

export const styleEmailRow = (isMobile) => ({
  padding: isMobile ? '0 1rem' : '0 2rem',
});

export const styleCommentRow = {
  padding: '0.5rem 2rem',
};

export const styleLeftColumn = (isMobile) => ({
  padding: isMobile ? '0.5rem 1rem 0.5rem 1rem' : '0.5rem 1rem 0.5rem 2rem',
  height: rowHeight,
});

export const styleRightColumn = (isMobile) => ({
  padding: isMobile ? '0.5rem 1rem 0.5rem 1rem' : '0.5rem 2rem 0.5rem 1rem',
  height: rowHeight,
});

export const ReferenceParentButton = styled.button`
  cursor: pointer;
`;

export const ReferenceParentName = styled.p`
  margin-bottom: 0;
  text-align: left;
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regular};
`;

export const ReferenceParentNamePlaceholder = styled.div`
  width: 50%;
  height: 20px;
  margin: 2px 0;
  background: ${palette.coolGrey3};
`;

export const TaskDrawerDivider = styled(Divider)`
  && {
    margin-top: ${spacing.smallExtraPlus};
    width: 100%;
    background-color: ${palette.coolGrey2};
    opacity: 0.3;
  }
`;

export const FiledInListName = styled.div`
  display: inline-block;
  vertical-align: bottom;
  color: ${palette.brightBlue};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 250px;
  cursor: pointer;
`;

export const SubscriptionBadge = styled.div`
  display: inline-block;
  float: right;

  & .MuiChip-root {
    color: white;
  }
`;

export const DueDateAndRemainderContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

export const CreateTaskLable = styled.div`
  color: #3d4858;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 135%;
  padding-left: 30px;
`;

export const NewTaskDrawerDivider = styled(Divider)`
  && {
    width: 100%;
    background-color: ${palette.coolGrey2};
    opacity: 0.3;
  }
`;

export const AddTaskDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  height: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 0 50px 20px 0;
`;
