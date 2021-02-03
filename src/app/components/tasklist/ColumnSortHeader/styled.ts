import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const SortButton = styled.button<{ width?: number }>`
  position: relative;
  flex: ${({ width }) => (width ? `${width}px 0 0` : '1')};
  padding: 8px 16px;
  height: 35px;
  overflow: visible;

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
  margin-bottom: 3px;
`;
