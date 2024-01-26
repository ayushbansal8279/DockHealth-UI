import styled from 'styled-components';
import palette from 'styles/palette';

export const HeaderMembersContainer = styled.div`
  display: flex;
  @media print {
    display: none;
  }
`;

export const MainHeaderContainer = styled.div`
  background-color: ${palette.white};
  z-index: 13;
  @media print {
    display: none;
  }
  &:hover {
    p {
      visibility: hidden;
    }
    box-shadow: 0px 13px 13px 0px rgba(0, 0, 0, 0.15);
  }
`;
