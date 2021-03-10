import { Link } from 'react-router-dom';
import styled from 'styled-components';
import palette from 'styles/palette';
import { H2 } from '../styled';

export const PlanContainer = styled.div`
  background-color: ${palette.coolGrey4};
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
  color: ${palette.veryDarkBlue};
  display: flex;
  font-weight: bold;
  line-height: 3.0625rem;
  height: 3.0625rem;
  min-height: 3.0625rem;
`;

export const PlanColumnLink = styled(Link)`
  color: ${palette.cyanBlue};
  cursor: pointer;
  filter: brightness(1);
  text-decoration: none;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;

export const SwitchBillingLink = styled.span`
  color: ${palette.cyanBlue};
  cursor: pointer;
  filter: brightness(1);
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;
