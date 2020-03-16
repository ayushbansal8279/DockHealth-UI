import styled from 'styled-components';

import SearchPersonSvg from '../img/search-person-icon.svg';

export const SearchPersonIcon = styled.img.attrs({
  alt: 'Search list person icon',
  src: SearchPersonSvg,
})`
  height: 6.25rem;
  margin: 1rem 0;
  object-fit: contain;
  width: 100%;
`;

export const SearchFieldContainer = styled.div`
  margin: 1rem;
  max-width: 1050px;
  position: relative;
  width: 100%;
`;
