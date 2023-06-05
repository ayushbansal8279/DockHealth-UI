import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const ViewContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 50px 20px;
  color: ${palette.mediumGrey};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const AddTemplateWrapper = styled.div`
  text-transform: none;
  color: ${palette.mediumGrey};

  &:before {
    position: absolute;
    top: 50%;
    left: -8px;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }
`;
