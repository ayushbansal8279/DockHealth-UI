import { Grid } from '@material-ui/core';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { H4 } from '../SubscriptionsView.Styled';

export const AnnualToggleContainer = styled(Grid)`
  && {
    background-color: #dedee2;
    border-radius: 0.25rem;
    cursor: pointer;
    height: 2.5rem;
    margin-top: 0.375rem;
    position: relative;
  }
`;

export const AnnualToggleLabel = styled(H4)`
  transition: all 0.25s ease;
  z-index: 2;
  ${props =>
    props.active
      ? 'color: #fff; font-weight: bold;'
      : 'color: #011845; font-weight: 600;'}
`;

export const AnnualToggleSwitch = styled.div`
  background: #074a86;
  box-shadow: 0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
  height: 100%;
  left: ${props => (props.active ? 50 : 0)}%;
  position: absolute;
  transition: all 0.25s ease;
  width: 50%;
  z-index: 1;
`;

export const SubscriptionCardGrid = styled(Grid)`
  && {
    margin-top: 2rem;
  }
`;

export const FeatureListInnerContainer = styled.div`
  background-color: #011845;
  color: #fff;
  flex: 1;
  flex-basis: auto;
`;

const FeatureHeaderElement = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 0 1rem;
`;

export const FeatureListHeader = styled(FeatureHeaderElement)`
  height: 4.8125rem;
  min-height: 4.8125rem;
`;

export const FeatureListContentHeader = styled(FeatureHeaderElement)`
  cursor: pointer;
  height: 5.25rem;
  min-height: 5.25rem;
`;

export const FeatureListChevronContainer = styled.img`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  margin-left: 1.5rem;
  transition: all 0.25s ease-out;
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
`;

export const FeatureRow = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  min-height: 2rem;
  padding: 0.125rem;
  padding-left: 1.6875rem;
  padding-right: 1.25rem;
  width: 100%;

  &:nth-child(even) {
    background-color: #1a2d56;
  }
`;

export const FeatureRowsContainer = styled(motion.div)``;
