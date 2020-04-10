import styled from 'styled-components';
import palette, { opacify } from '../../../palette';

export const InvoicesListContainer = styled.div`
  width: 100%;
`;

export const InvoicesTable = styled.table`
  && {
    border: 0;
    border-spacing: 0;

    & th,
    & td {
      padding: 0.5rem 1rem;
    }

    & thead {
      background: ${opacify(palette.coolGrey2, 0.3)};

      & tr {
        background: transparent;
        height: 2rem;
        min-height: 2rem;
      }

      & th {
        background: transparent;
        border-bottom: 0.0625rem ${palette.coolGrey2} solid;
        color: ${palette.mediumGrey};
        font-size: 0.875rem;
        vertical-align: middle;
      }
    }

    & tbody {
      & tr {
        height: 3rem;
        min-height: 3rem;
      }

      & tr:nth-child(even) {
        background: ${palette.white};
      }

      & tr:nth-child(odd) {
        background: ${palette.coolGrey4};
      }

      & td {
        color: ${palette.darkGrey};
        font-size: 0.875rem;
      }
    }
  }
`;

export const InvoiceColumn = styled.th`
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
`;

export const InvoiceColumnInnerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
`;

export const SortingIconContainer = styled.div`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  margin-left: 0.25rem;
  width: 0.75rem;
`;

export const SortingIconImage = styled.img`
  height: 100%;
  object-fit: contain;
  object-position: center;
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
  transition: all 0.25s ease-out;
  width: 100%;
`;

export const ChargeDetailsLink = styled.a`
  color: ${palette.cyanBlue};
  cursor: pointer;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;
