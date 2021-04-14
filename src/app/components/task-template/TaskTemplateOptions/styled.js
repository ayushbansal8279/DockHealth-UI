import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const Item = styled.div`
  cursor: pointer;
  padding: ${spacing.regular};
  color: ${palette.mediumGrey};
`;
