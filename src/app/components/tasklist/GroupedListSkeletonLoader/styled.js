import styled from 'styled-components';
import spacing from 'styles/spacing';

export const Container = styled.div`
  padding: 72px ${spacing.huge} 0;
`;

export const LoaderGroup = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 64px;
  }
`;
