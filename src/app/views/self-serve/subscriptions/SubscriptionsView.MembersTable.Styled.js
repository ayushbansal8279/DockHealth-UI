import styled from 'styled-components';

export const MembersTableContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

export const MemberTable = styled.table`
  && {
    border: 0;
    border-spacing: 0;

    & th,
    & td {
      padding: 0.125rem;
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

      & tr td:nth-child(-n + 2) {
        text-align: center;
      }

      & td {
        color: #303538;
        font-size: 0.875rem;
      }
    }
  }
`;
