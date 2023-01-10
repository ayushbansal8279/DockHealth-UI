/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const ViewTypeImg = styled.img`
  width: 21px;
  ${({ iconColorFilterActive }) =>
    iconColorFilterActive
      ? `filter: ${iconColorFilterActive}; `
      : 'filter: invert(60%) sepia(60%) saturate(1790%) hue-rotate(348deg) brightness(100%) contrast(88%);'}
`;
