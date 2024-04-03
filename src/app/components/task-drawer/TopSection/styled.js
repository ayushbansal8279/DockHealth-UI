import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette from '@/app/styles/palette';

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  width: 100%;

  &:hover {
    background-color: #f5f5f5;
  }
`;


export const Title = styled.span`
  margin-top: 2px;
  color: ${palette.mediumGrey};
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 135%; /* 21.6px */
`;

export const CompletedByTitle = styled.span`
  margin: 2px 5px;
  color: ${palette.crystalBlue};
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 135%;
`;

export const CompleteAge = styled.span`
  margin-top: 2px;
  color: ${palette.shadowBlue};
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 135%;
`;