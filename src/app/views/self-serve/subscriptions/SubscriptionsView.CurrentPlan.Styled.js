import { Link } from 'react-router';
import styled from 'styled-components';
import { H2 } from './SubscriptionsView.Styled';

export const PlanContainer = styled.div`
  background-color: #f9fafc;
  display: grid;
  font-size: 1rem;
  grid-gap: 1rem;
  grid-template-columns: 1fr auto;
  height: min-content;
  padding: 1.5rem;
  width: 100%;
`;

export const PlanNameLabel = styled(H2)`
  align-items: baseline;
  color: #2a4a70;
  display: flex;
  font-weight: bold;
  line-height: 3.0625rem;
  height: 3.0625rem;
  min-height: 3.0625rem;
`;

export const PlanColumnLink = styled(Link)`
  color: #007cab;
  cursor: pointer;
  filter: brightness(1);
  text-decoration: none;
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;

export const SwitchBillingLink = styled.span`
  color: #007cab;
  cursor: pointer;
  filter: brightness(1);
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;
