import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const ViewTypeImg = styled.img`
  width: 21px;
  height: 21px;
  ${({ iconColorFilterActive }) =>
    iconColorFilterActive
      ? `filter: ${iconColorFilterActive}; `
      : 'filter: invert(60%) sepia(60%) saturate(1790%) hue-rotate(348deg) brightness(100%) contrast(88%);'}
`;
