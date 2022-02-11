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

export const LabelWrapper = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SortButton = styled.button<{
  width?: number;
  truncateEnabled?: boolean;
}>`
  position: relative;
  flex: ${({ width }) => (width ? `0 0 ${width}px` : '1')};
  overflow: ${({ truncateEnabled }) =>
    truncateEnabled ? 'hidden' : 'visible'};
  padding: 8px 16px;
  height: 35px;
  text-align: left;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
  color: ${palette.mediumGrey};
`;

export const SortArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
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
`;
