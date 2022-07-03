import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const DescriptionTooltipWrapper = styled.div`
  display: block;
  width: 100%;
  padding: ${spacing.small};
  color: ${palette.white};
  background: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  cursor: initial;
`;

export const LabelWrapper = styled.p<{ ordered: boolean }>`
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ ordered }) => (ordered ? palette.brightBlue : palette.coolGrey1)};
`;

export const SortButton = styled.button<{
  printWidth?: number;
  width?: number;
}>`
  position: relative;
  flex: ${({ width }) => (width ? `0 0 ${width}px` : '1')};
  height: 35px;
  text-align: left;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
  color: ${palette.mediumGrey};
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
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  background: ${palette.white};
  border: 1px solid ${palette.coolGrey3};
  border-left: 0px;
  margin-bottom: 3px;

  @media print {
    border: 1px solid ${palette.coolGrey1};
  }
`;
