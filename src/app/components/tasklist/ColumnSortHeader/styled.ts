import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const ResizeHandler = styled.div<{ enabled: boolean }>`
  position: absolute;
  top: 0;
  left: calc(100% - 1px);
  width: 1px;
  height: 35px;
  background-color: ${palette.coolGrey3};
  z-index: 1;
  cursor: ew-resize;
  ${({ enabled }) => (enabled ? `` : 'display: none;')}

  &:hover {
    &:after {
      opacity: 1;
      background-color: ${palette.coolGrey2};
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 0px;
    left: -2px;
    width: 5px;
    height: 35px;
    background-color: none;
    cursor: ew-resize;
    opacity: 0;
    transition: opacity 0.3s;
  }
`;

export const DescriptionTooltipWrapper = styled.div`
  display: block;
  width: 100%;
  padding: ${spacing.small};
  color: ${palette.white};
  background: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  cursor: initial;
`;

export const LabelWrapper = styled.div<{
  ordered: boolean;
  flex: number;
  tasksHeaderTextColor: string;
}>`
  display: flex;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 18px;
  color: ${({ ordered, tasksHeaderTextColor }) =>
    ordered ? palette.brightBlue : tasksHeaderTextColor || palette.offBlack};
  &:hover > div > div > div > img {
    visibility: visible;
  }
  &:hover > div > div:nth-child(2) > div {
    visibility: visible;
  }
`;

export const SortButton = styled.button<{
  printWidth?: number;
  width?: number;
  flex?: number;
  tasksHeaderTextTransform?: string;
  isDragActive: Boolean;
  isDraggedOver: Boolean;
  hoveredIndex: number;
  hoverBorderSide: string;
}>`
  position: relative;
  ${({ width }) => {
    if (typeof width === 'number') {
      return `width: ${width}px;`;
    }
    return `width: ${width};`;
  }}
  height: 35px;
  text-align: left;
  font-family: inherit;
  background: ${({ isDragActive }) =>
    isDragActive ? palette.brightBlueWithAlpha : palette.white};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  ${({ tasksHeaderTextTransform }) =>
    tasksHeaderTextTransform
      ? `text-transform: ${tasksHeaderTextTransform};`
      : 'text-transform: uppercase;'};
  ${({ flex }) => (flex ? `flex: ${flex};` : '')};
  ${({ isDraggedOver, hoverBorderSide, hoveredIndex }) => {
    if (!isDraggedOver) return '';
    if (hoveredIndex === 1 && hoverBorderSide === 'left')
      return `background-color: ${palette.coolGrey3};`;
    if (hoverBorderSide === 'left') {
      return `border-left: 3px solid ${palette.azureBlue};
      background-color: ${palette.coolGrey3};
      `;
    }

    return `border-right: 3px solid ${palette.azureBlue};
    background-color: ${palette.coolGrey3};`;
  }};

  &:hover {
    background-color: ${palette.coolGrey3};
  }
  @media print {
    ${({ printWidth }) =>
      printWidth &&
      `
      width: ${printWidth}px;
      min-width: ${printWidth}px;
      max-width: ${printWidth}px;
  `};
  }
`;

export const DragPreviewWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${palette.white};
  color: black;
  padding: 6px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 200px;
  height: 35px;
  cursor: grabbing;
  user-select: none;
  opacity: 0.6;
`;

export const DragPreviewText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
  ${({ tasksHeaderTextTransform }) =>
    tasksHeaderTextTransform
      ? `text-transform: ${tasksHeaderTextTransform};`
      : 'text-transform: uppercase;'};
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
`;

export const ThreeDots = styled.img<{ hideIcon: boolean }>`
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  ${({ hideIcon }) => `opacity: ${hideIcon ? 0 : 1};`}
  &:active {
    opacity: 1;
  }
  visibility: hidden;
`;

export const SortHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: ${({ listPageGroupHeader, isWidthGreaterThanHundredPercent }) =>
    listPageGroupHeader
      ? !isWidthGreaterThanHundredPercent
        ? '100%'
        : ''
      : ''};
  background: ${palette.white};
  border: 1px solid ${palette.coolGrey3};
  border-left: 1px;
  ${({ origin }) => (origin === 'LIST' ? 'margin-bottom: 3px' : '')};

  @media print {
    border: 1px solid ${palette.coolGrey1};
    border-left: 1px solid ${palette.coolGrey3};
    justify-content: flex-start;
    align-items: left;
    page-break-inside: avoid;
  }
`;

export const TaskIconWrapper = styled.div`
  margin-right: 5px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  img {
    width: 15px;
    height: 15px;
    filter: invert(42%) sepia(8%) saturate(1089%) hue-rotate(162deg)
      brightness(92%) contrast(87%);
  }
`;

export const PatientIconWrapper = styled.div`
  margin-right: 5px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #5a6c7d;
`;
