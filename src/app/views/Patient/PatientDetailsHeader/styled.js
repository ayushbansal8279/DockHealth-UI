import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const PatientDetailsHeaderContainer = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  display: flex;
  background-color: white;
  align-items: center;
  padding: ${spacing.huge};
`;

export const PatientName = styled.div`
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
`;

export const PatientInfo = styled.div`
  padding: 0 ${spacing.huge};
  color: ${palette.mediumGrey};
`;

export const PatientInfoDivider = styled.div`
  height: 13px; // per design
  width: 1px; // per design
  background-color: ${palette.mediumGrey};

  &:last-child {
    visibility: hidden;
  }
`;
