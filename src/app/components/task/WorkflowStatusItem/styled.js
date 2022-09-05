import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import prop from 'ramda/src/prop';
import { Close } from '@material-ui/icons';

export const DeleteStatusIcon = styled(Close)`
  && {
    display: none;
    width: 20px;
    height: 20px;
    color: ${palette.coolGrey2};
    cursor: pointer;
  }
`;

export const DragHandle = styled.div`
  position: absolute;
  top: 50%;
  left: 1px;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
  color: ${palette.coolGrey2};
  opacity: 0;
  transition: opacity 0.3s ease-out;
  cursor: grab;
  outline: none;
`;

export const StatusItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: ${spacing.tiny} ${spacing.smallPlus} ${spacing.tiny}
    ${spacing.regular};
  overflow: hidden;

  &:hover {
    & ${DeleteStatusIcon} {
      display: block;
    }

    & ${DragHandle} {
      opacity: 1;
    }
  }
`;

export const StatusItemContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  background-color: ${({ editing }) =>
    editing ? palette.coolGrey4 : palette.white};
`;

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 24px;
  flex: 6px 0 0;

  ${({ border }) => border && `border: 1px solid ${palette.coolGrey3};`}
`;

export const StatusNameInput = styled.input`
  display: block;
  flex: 1;
  min-width: 0;
  padding: 0 ${spacing.small};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  outline: none;
  text-overflow: ellipsis;
  overflow: hidden;
  background: transparent;

  &:disabled {
    background: transparent;
  }
`;

export const StatusName = styled.p`
  flex: 1;
  text-align: left;
  margin-bottom: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${palette.mediumGrey};
`;

export const NameLoader = styled.div`
  flex: 1;
  height: 16px;
  background-color: ${palette.skeletonLoader};
`;

export const StatusButton = styled.button`
  ${({ selected }) => selected && `background-color: ${palette.coolGrey4};`}
  overflow: hidden;

  &:hover {
    background-color: ${palette.coolGrey4};

    & ${StatusName} {
      font-weight: bold;
    }
  }
`;
