import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette from '../../../palette';
import { H3 } from './SubscriptionsView.Styled';

export const MembersTableContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

export const MemberTable = styled.table`
  && {
    border: 0;
    border-spacing: 0;
    margin-top: 0.75rem;

    & th,
    & td {
      padding: 0.125rem;
    }

    & thead {
      background: ${palette.coolGrey3};

      & tr {
        background: transparent;
        height: 2rem;
        min-height: 2rem;
      }

      & th {
        background: transparent;
        border-bottom: 0.0625rem ${palette.coolGrey3} solid;
        color: ${palette.mediumGrey};
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
        background: ${palette.white};
      }

      & tr:nth-child(odd) {
        background: ${palette.coolGrey4};
      }

      ${props =>
        !props.isSmallScreen &&
        `& tr td:nth-child(-n + 2) {
        text-align: center;
      }`}

      & td {
        color: ${palette.unknownGrey1};
        font-size: 0.875rem;
      }
    }
  }
`;

export const HeaderCaptionGrid = styled(Grid)`
  height: 2.25rem;
  min-height: 2.25rem;

  & > :first-child {
    margin-right: 1.5rem;
  }
`;

export const SubscriptionStatusSwitchLabel = styled(H3)`
  cursor: pointer;
  margin-left: 2rem;
  ${props => props.selected && 'font-weight: bold; text-decoration: underline;'}
`;

export const SwitcherContainer = styled.div`
  align-items: center;
  background-color: ${palette.coolGrey4};
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  height: 3.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 0;
  width: 100%;
`;

export const SwitcherChevronContainer = styled.div`
  align-items: center;
  background-color: ${palette.unknownGrey6};
  border-radius: 0.25rem;
  display: flex;
  height: 100%;
  justify-content: center;
  margin-left: 1rem;
  width: 2.5rem;
`;

export const SwitcherChevronImage = styled.img`
  height: 1rem;
  object-fit: contain;
  width: 1rem;
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
  transition: all 0.25s ease-out;
`;

export const MembersTableSearchContainer = styled.div`
  width: 14rem;
`;
