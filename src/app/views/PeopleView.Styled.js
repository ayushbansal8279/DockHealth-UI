import styled from 'styled-components';

export const HeaderLabel = styled.div`
  font-size: ${props => (props.small ? 1 : 2.25)}rem;
  line-height: 1.1;
  margin: 0;
`;

export const SearchContainer = styled.div`
  margin: 2rem 0;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;
