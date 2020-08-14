import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
// eslint-disable-next-line import/prefer-default-export
export const OrganizationIdentifierContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regular};

  margin-top: ${props => spacing[props.top] || props.top};
  margin-bottom: ${props => spacing[props.bottom] || props.bottom};
  margin-left: ${props => spacing[props.left] || props.left};
  margin-right: ${props => spacing[props.right] || props.right};

  & > span {
    margin-left: 8px;
  }
`;
