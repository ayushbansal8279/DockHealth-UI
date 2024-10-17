import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import prop from 'ramda/src/prop';
import { Close } from '@mui/icons-material';

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
  width: fit-content;
  padding: ${spacing.tiny} 0 ${spacing.tiny} ${spacing.regular};
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

export const StatusWrapper = styled.div`
  display: flex;
  border-radius: 2px;
  border: 1px solid ${(property) => property.color || '#7F4334'};
  background: ${(property) => `${property.color}1A` || '#7F43341A'};
  min-width: 100px;
  padding: 2.5px 2px;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  color: ${(property) => property.color || '#7F4334'};
  position: relative;
`;

export const StatusItemContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-width: 100px;
  overflow: hidden;
  background-color: ${({ editing }) =>
    editing ? palette.coolGrey4 : palette.white};
    width: fit-content;
`;

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 24px;
  width: 6px;
  flex-shrink: 0;

  ${({ border }) => border && `border: 1px solid ${palette.coolGrey3};`}
`;

export const StatusNameInput = styled.input`
  width: 100%;
  display: block;
  flex: 1;
  min-width: 0;
  padding: 0 ${spacing.small};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  outline: none;
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
  width: ${({ width }) => width}px;

  &:hover {
    background-color: ${palette.coolGrey4};

    & ${StatusName} {
      font-weight: bold;
    }
  }
`;

export const StatusTooltip = styled.div`
  display: none;
  position: absolute;
  right: 10; 
  left: 10;
  bottom: -5;
  color: ${palette.black};
  background-color: ${palette.whiteSmoke};
  font-size: 14px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  border-radius: '4px';
  padding: 5px 10px;
  z-index: 100;
  white-space: normal;
  overflow-wrap: break-word;
  transform: translateY(100%);
`;

export const StatusLabel = styled.div`
  &:hover {
    + ${StatusTooltip} {
      display: block;
    }
  }
`