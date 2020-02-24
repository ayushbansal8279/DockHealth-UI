import styled from 'styled-components';

export const InvoicesListContainer = styled.div`
  margin-top: 4rem;
`;

export const InvoicesTable = styled.table`
  && {
    border: 0;
    border-spacing: 0;

    & th,
    & td {
      padding: 0.125rem 0.5rem;
    }

    & thead {
      background: #efeff0;

      & tr {
        background: transparent;
        height: 2rem;
        min-height: 2rem;
      }

      & th {
        background: transparent;
        border-bottom: 0.0625rem #d7d7dc solid;
        color: #4a4a4a;
        font-size: 0.875rem;
        font-weight: 600;
        vertical-align: middle;
      }
    }

    & tbody {
      & tr {
        height: 5rem;
        min-height: 5rem;
      }

      & tr:nth-child(even) {
        background: #fff;
      }

      & tr:nth-child(odd) {
        background: #fafafb;
      }

      & td {
        color: #303538;
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
  color: #007cab;
  cursor: pointer;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;
