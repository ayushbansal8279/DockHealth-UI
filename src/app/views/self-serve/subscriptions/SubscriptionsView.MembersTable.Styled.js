import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette, { opacify } from 'app/palette';
import { H3 } from './SubscriptionsView.Styled';

export const MembersTableContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

export const MemberTable = styled.table`
  && {
    border: 0;
    border-spacing: 0;
    font-size: 0.875rem;
    margin-bottom: 0;
    margin-top: 0.75rem;

    & th,
    & td {
      padding: 0.125rem;
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

export const SwitcherContainer = styled.div`
  align-items: center;
  display: flex;
  cursor: pointer;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 100%;
`;

export const SwitcherChevronContainer = styled.div`
  height: 100%;
`;

export const MediumGreyLabelContainer = styled.span`
  color: ${palette.coolGrey1};
`;

export const SubscriptionStatusSwitchLabel = styled(H3)`
  cursor: pointer;
  margin-left: 2rem;
  ${props => props.selected && 'font-weight: bold; text-decoration: underline;'}
`;

export const MembersTableSearchContainer = styled.div`
  width: 14rem;
`;
