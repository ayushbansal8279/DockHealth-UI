import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ResizeHandler = styled.div<{ enabled: boolean }>`
  position: absolute;
  top: 0;
  left: calc(100% - 2px);
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

export const LabelWrapper = styled.div<{ ordered: boolean; flex: number }>`
  display: flex;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ ordered }) => (ordered ? palette.brightBlue : palette.coolGrey1)};
`;

export const SortButton = styled.button<{
  printWidth?: number;
  width?: number;
  flex?: number;
}>`
  position: relative;
  ${({ width }) => (width ? `width: ${width}px;` : '')}
  height: 35px;
  text-align: left;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
  color: ${palette.mediumGrey};
  ${({ flex }) => (flex ? `flex: ${flex};` : '')};
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

export const ThreeDots = styled.img<{ hideIcon: boolean }>`
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  ${({ hideIcon }) => `opacity: ${hideIcon ? 0 : 1};`}

  &:active {
    opacity: 1;
  }
`;

export const SortHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start; //changed start => end
  align-items: center;
  width: 100%;
  background: ${palette.white};
  border: 1px solid ${palette.coolGrey3};
  border-left: 0px;
  margin-bottom: 3px;

  @media print {
    border: 1px solid ${palette.coolGrey1};
    border-left: 1px solid ${palette.coolGrey3};
    justify-content: flex-start;
    align-items: left;
    page-break-inside: avoid;
  }
`;
