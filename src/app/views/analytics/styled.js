/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const ViewContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 12px;
`;

export const ChartsContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 32px;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;
