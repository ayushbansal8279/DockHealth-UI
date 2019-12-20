import styled from 'styled-components';

import SearchPersonSvg from '../img/search-person-icon.svg';
import Search from '../components/taskView/Search';

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
  max-width: 43.5rem;
  position: relative;
  width: 100%;
`;

export const StyledSearch = styled(Search)`
  && {
    width: 100%;
  }
`;
