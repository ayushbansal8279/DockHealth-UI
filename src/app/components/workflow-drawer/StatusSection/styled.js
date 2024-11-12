import { fontSizes, fontWeights } from '@/app/styles/font';
import palette from '@/app/styles/palette';
import prop from 'ramda/src/prop';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  width: 20%;
  justify-content: flex-start;
  padding: ${spacing.tiny} 0;
`;

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 1.25rem;
  width: 0.25rem;
`;

export const StatusFieldContainer = styled.div`
  margin-left: 1px;
  width: 90px;
  display: flex;
`;

export const StatusFlagContainer = styled.div`
  left: -0.25rem;
  position: absolute;
  top: calc(50% + 0.625rem);
  transform: translate(-100%, -50%);
`;

export const Title = styled.div`
  margin-left: 10px;
  margin-right: 45px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;

export const StatusWrapper = styled.div`
  display: flex;
  border-radius: 2px;
  border: 1px solid ${(property) => property.color || '#7F4334'};
  background: ${(property) => `${property.color}1A` || '#7F43341A'};
  min-width: 100px;
  padding: 2.5px 2px;
  height: 28px;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  color: ${(property) => property.color || '#7F4334'};
`;
