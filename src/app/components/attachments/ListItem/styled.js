import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const Row = styled.div`
  display: grid;
  width: 100%;
  height: 35px;
  grid-template-columns: 1fr 200px 150px 50px;
  grid-gap: 12px;
  align-items: center;
  border: 1px solid ${palette.coolGrey2};
  background-color: ${palette.white};

  @media print {
    height: auto;
  }

  ${({ clickable }) =>
    clickable &&
    `
      &:hover {
        cursor: pointer;
      }
  `}
`;

export const HeaderRow = styled(Row)`
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const Cell = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: inherit;
  font-weight: ${({ bold }) => (bold ? fontWeights.bold : fontWeights.regular)};
  font-size: ${fontSizes.smallPlus};
  color: ${palette.mediumGrey};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderCell = styled(Cell)`
  color: ${palette.coolGrey1};
`;
