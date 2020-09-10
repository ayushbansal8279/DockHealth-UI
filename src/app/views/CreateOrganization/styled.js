import styled from 'styled-components';
import palette from 'styles/palette';

export const Background = styled.div`
  background-color: ${palette.white};
  min-height: 100%;
  height: fit-content;
`;

export const Navbar = styled.nav`
  align-items: center;
  background-color: ${palette.midnightBlue};
  display: flex;
  height: 5.75rem;
  justify-content: flex-end;
  padding: 1rem 2.375rem;
  width: 100%;

  > a {
    height: 100%;
  }
`;

export const Logo = styled.img`
  height: 100%;
  object-fit: contain;
`;

export const MainContainer = styled.main`
  box-sizing: content-box;
  margin: 0 auto;
  max-width: 946px;
  padding: ${props => (props.isSmallScreen ? 0.5 : 3.25)}rem;
`;
