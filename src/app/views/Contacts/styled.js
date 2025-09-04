import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const ViewContainer = styled.div`
  // max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  color: ${palette.mediumGrey};
  font-family: inherit;
  padding: 32px 52px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  gap: 32px;
`;

export const AddContactWrapper = styled.div`
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
