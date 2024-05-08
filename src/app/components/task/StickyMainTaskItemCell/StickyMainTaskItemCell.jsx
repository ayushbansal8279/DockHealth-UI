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
  left: ${({
    isSubtask,
    isWorkflowSubtask,
    origin,
    searchValue,
    isFilterApply,
    isSortApplied,
  }) =>
    origin === 'PATIENT'
      ? isSubtask || isWorkflowSubtask
        ? '60px'
        : '24px'
      : origin === 'LIST'
      ? isSubtask || isWorkflowSubtask
        ? searchValue || isFilterApply || isSortApplied
          ? '54.5px'
          : '90.5px'
        : '54.5px'
      : '24px'};
  ${({ order }) => (order ? `order: ${order};` : '')}
  border-left: 2px solid
    ${({ isWorkflowtask, isTamplateGroup }) =>
    isWorkflowtask || isTamplateGroup
      ? 'rgba(75, 179, 253, 1)'
      : `${palette.coolGrey3}`};
  margin-left: ${({ isTamplateGroup }) => (isTamplateGroup ? '1px;' : '0px')};
  align-items: center;
  padding-left: ${spacing.smallPlus};
  z-index: ${({ isEditingDescription }) =>
    isEditingDescription ? '12' : '11'};

  border-top-left-radius: ${({ isTamplateGroup }) =>
    isTamplateGroup ? '3px' : ''};
  border-bottom-left-radius: ${({ isTamplateGroup }) =>
    isTamplateGroup ? '1px' : ``};
  border-bottom-left-radius: ${({ isWorkflowtask, isLastChild }) =>
    isWorkflowtask && isLastChild ? '1px' : ``};

  background-color: ${(props) =>
    props.isSelected
      ? palette.brightBlueWithAlpha
      : // eslint-disable-next-line unicorn/no-nested-ternary
      props.hasEscalations
      ? palette.bananaHammockLight
      : // eslint-disable-next-line unicorn/no-nested-ternary
      props.customHighlight ?? palette.white};

  &::before {
    content: '';
    display: block;
    background: ${({ backgroundColor }) =>
      backgroundColor || palette.coolGrey4};
    position: absolute;
    left: -101px;
    top: -3px;
    width: 100px;
    height: calc(100% + 4px);
    z-index: -1;

    @media print {
      left: -102px;
    }
  }

  &::after {
    content: '';
    display: block;
    transition: background-color 0.3s ease-out;
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: calc(100% - 2px);
    z-index: -1;
    transform: translateY(-50%);
    animation: ${(props) =>
      props.newlyCreated
        ? css`
            ${highlightDescription} 6s ease-out;
          `
        : ''};
  }

  &:hover {
    border-left: 2px solid
      ${({ isWorkflowtask, isTamplateGroup }) =>
        isWorkflowtask || isTamplateGroup
          ? 'rgba(75, 179, 253, 1)'
          : `${palette.coolGrey2}`};
  }

  @media print {
    border-left: 1px solid ${palette.coolGrey1} !important;
    min-width: 200px;
    max-width: 300px;
    height: auto;
  }
`;

export default StickyMainTaskItemCell;
