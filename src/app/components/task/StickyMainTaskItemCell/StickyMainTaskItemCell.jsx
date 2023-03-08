import styled, { keyframes, css } from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const highlightDescription = keyframes`
  0% {
      background: ${palette.dockBlueLight};
  }
  100% {
      background: ${palette.white};
  }
`;

const StickyMainTaskItemCell = styled.div`
${({ customWidthExists }) => (customWidthExists ? '' : 'flex: 1;')}
  position: sticky;
  display: flex;
  width: ${({ width, isSubtask }) => {
    if (width && isSubtask) return `${width - 36}px`;
    if (width && !isSubtask) return `${width}px`;
    return '';
  }};
  left: ${({ isSubtask }) => (isSubtask ? '60px' : '24px')};
  ${({ order }) => (order ? `order: ${order};` : '')}
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
    top: -1;
    width: 100px;
    height: calc(100% + 2px);
    z-index: -1;
    
    @media print {
      left: -102px;
    }
  }

  &::after {
    content: '';
    display: block;
    background-color: ${props =>
      // eslint-disable-next-line unicorn/no-nested-ternary
      props.isSelected
        ? palette.brightBlueWithAlpha
        : // eslint-disable-next-line unicorn/no-nested-ternary
        props.hasEscalations
        ? palette.oPlusRedLight
        : // eslint-disable-next-line unicorn/no-nested-ternary
        props.customHighlight
        ? props.customHighlight
        : palette.white};
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

  @media print {
    border-left: 1px solid ${palette.coolGrey1} !important;
    min-width: 200px;
    max-width: 300px;
    height: auto;
  }
`;

export default StickyMainTaskItemCell;
