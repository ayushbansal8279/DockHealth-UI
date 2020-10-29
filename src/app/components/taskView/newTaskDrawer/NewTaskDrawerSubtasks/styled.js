import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  padding: 42px ${spacing.huge};
  border-top: 1px solid ${palette.coolGrey2};
`;

export const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;

export const AddSubtaskButton = styled.button`
  display: flex;
  align-items: center;
  margin-top: ${spacing.large};
  margin-left: 42px;
  padding: ${spacing.smallPlus} ${spacing.regular};
  background: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
  text-transform: uppercase;
  cursor: pointer;

  & > span {
    margin-right: ${spacing.small};
    color: ${palette.brightBlue};
  }
`;
