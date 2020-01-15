import { Link } from 'react-router';
import styled from 'styled-components';

import { H2 } from './SubscriptionsView.Styled';

export const PlanContainer = styled.div`
  background-color: #f8f8f9;
  border: 1px solid #ededf0;
  border-radius: 0.25rem;
  display: flex;
  flex-flow: column nowrap;
  padding: 1.375rem;
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
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;
