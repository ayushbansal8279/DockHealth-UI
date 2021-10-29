import { withStyles } from '@material-ui/core/styles';
import MuiSwitch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const SubscriptionsViewOuterContainer = styled.div`
  background-color: ${palette.white};
  display: flex;
  min-height: 100%;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 24px;
`;

export const SubscriptionsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;
  max-width: 1200px;
  width: 1200px;
`;

export const SubscriptionPlansContainer = styled.div`
  width: 881px;
  margin: 0 auto;
`;

export const SubscriptionsTitle = styled.h2`
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.light};
`;

export const Switch = withStyles({
  switchBase: {
    color: `${palette.midnightBlue} !important`,
  },
})(MuiSwitch);

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SwitchLabel = styled.p`
  display: block;
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${({ active }) =>
    active ? fontWeights.regular : fontWeights.light};
  color: ${({ active }) => (active ? palette.oPlusRed : palette.black)};

  &:first-of-type {
    margin-right: 8px;
  }

  &:last-of-type {
    margin-left: 8px;
  }
`;

export const ProfessionalServicesTitle = styled.p`
  margin-bottom: 0;
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
`;

export const Title = styled.p`
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  margin-bottom: 0;
`;

export const TitleDescription = styled.span`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
`;

export const BillingTableCell = styled.td`
  padding: 24px 48px;
  text-align: left;
  font-weight: ${fontWeights.light};
`;

export const BillingTableHeaderCell = styled.th`
  padding: 4px 48px;
  text-align: left;
  font-weight: ${fontWeights.light};
`;

export const BillingTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  &
    ${BillingTableCell}:first-of-type,
    &
    ${BillingTableHeaderCell}:first-of-type {
    width: 250px;
  }

  & ${BillingTableCell}:last-of-type, & ${BillingTableHeaderCell}:last-of-type {
    width: 300px;
  }
`;

export const BillingTableRow = styled.tr``;

export const BillingTableHeaderRow = styled.tr`
  background-color: rgba(193, 204, 218, 0.3);
`;

export const BillingTableSummaryRow = styled.tr`
  background-color: rgba(193, 204, 218, 0.3);

  & ${BillingTableCell} {
    padding-top: 4px;
    padding-bottom: 4px;
    font-size: ${fontSizes.huge};
    font-weight: ${fontWeights.bold};
  }
`;
