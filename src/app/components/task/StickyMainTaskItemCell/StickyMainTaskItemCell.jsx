import styled, { keyframes, css } from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const highlightDescription = keyframes`
  0% {
      background: #e0eff9;
  }
  100% {
      background: ${palette.white};
  }
`;

const StickyMainTaskItemCell = styled.div`
  position: sticky;
  display: flex;
  flex-basis: 500px;
  flex-grow: 1;
  flex-shrink: 0;
  left: ${({ isSubtask }) => (isSubtask ? '61px' : '24px')};
  border-left: 1px solid ${palette.coolGrey3};
  border-right: 1px solid ${palette.coolGrey3};
  align-items: center;
  padding-left: ${spacing.smallPlus};
  z-index: ${({ isEditingDescription }) =>
    isEditingDescription ? '12' : '11'};

  &::before {
    content: '';
    display: block;
    background: ${({ backgroundColor }) =>
      backgroundColor || palette.coolGrey4};
    position: absolute;
    left: -101px;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: calc(100% + 6px);
    z-index: -1;
  }

  &::after {
    content: '';
    display: block;
    background-color: ${props =>
      props.isSelected ? '#e0eff9' : palette.white};
    transition: background-color 0.3s ease-out;
    position: absolute;
    left: 0px;
    top: 50%;
    width: 100%;
    height: calc(100% - 2px);
    z-index: -1;
    transform: translateY(-50%);
    animation: ${props =>
      props.newlyCreated
        ? css`
            ${highlightDescription} 6s ease-out;
          `
        : ''};
  }
`;

export default StickyMainTaskItemCell;
