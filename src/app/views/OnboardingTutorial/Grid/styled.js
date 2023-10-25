import palette from 'styles/palette';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const ActionIconsContainer = styled.div`
  display: flex;
  position: relative;
  width: 65px;
  &::after {
    border-right: 1px solid ${palette.coolGrey3};
    content: '';
    position: absolute;
    top: -4px;
    left: 100%;
    width: 0px;
    height: 36px;
  }
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
  align-self: center;
  ${({ isCompleted }) => !isCompleted && `margin-left: 2px;`}
  opacity: ${({ isClickable }) => (isClickable ? '1' : '0.5')};
`;

export const BlankCellContent = styled.div`
  background-color: #e5e9f2;
  height: 25px;
  width: 100%;
`;

export const AvatarIconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`;
