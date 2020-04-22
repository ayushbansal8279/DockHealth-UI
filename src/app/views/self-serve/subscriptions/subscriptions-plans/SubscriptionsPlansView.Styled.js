import styled from 'styled-components';
import palette from 'styles/palette';

export const H1 = styled.h1`
  font-size: 2.25rem;
  margin: 0.25rem 0;
`;

export const H2 = styled.h2`
  font-size: 1.5rem;
  margin: 0.2rem 0;
`;

export const H3 = styled.h3`
  font-size: 1rem;
  margin: 0.15rem 0;
`;

export const H4 = styled.h4`
  font-size: 0.875rem;
  margin: 0.1rem 0;
`;

export const SubscriptionsPlansViewContainer = styled.div`
  background-color: ${palette.white};
  width: 100%;
`;

export const SubscriptionsPlansInnerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2.75rem 1fr;
`;

export const SubscriptionPlanPanel = styled.div`
  background-color: ${palette.coolGrey4};
  color: ${palette.darkBlue};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 2rem;
`;

export const SubscriptionPlanDarkPanel = styled.div`
  background-color: ${palette.darkBlue};
  color: ${palette.white};
  padding: 1rem 1.5rem;
`;

export const MediumGreyLabelContainer = styled.div`
  color: ${palette.mediumGrey};
`;

export const SubscriptionEnterprisePanel = styled.div`
  background-color: ${palette.coolGrey4};
  color: ${palette.darkBlue};
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto 1fr auto;
  padding: 1.5rem;
  width: 100%;
`;

export const StyledAnchor = styled.a`
  color: ${palette.darkBlue};
  text-decoration: underline;
`;

export const StyledAnchorDiv = styled.div`
  color: ${palette.darkBlue};
  cursor: pointer;
  display: inline-block;
  text-decoration: underline;
`;

export const Title = styled(H1)`
  color: ${palette.white};
  padding-left: 2rem;
`;

export const PlanLabel = styled.h1`
  font-size: 1.875rem;
  margin: 0;
`;

export const TermsLabel = styled.p`
  font-size: 0.6875rem;
  margin: 1rem 0 3rem;
  padding: 0 0.5rem;
`;
