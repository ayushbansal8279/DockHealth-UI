import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const HeaderMembersContainer = styled.div`
  display: flex;
  @media print {
    display: none;
  }
`;

export const MainHeaderContainer = styled.div`
  background-color: ${palette.white};
  z-index: 13;

  box-shadow: ${(props) =>
      props.showShadow
        ? '0px 13px 13px 0px rgba(0, 0, 0, 0.15);'
        : '0px 0px 0px 0px;'}
    @media print {
    display: none;
  }
  &:hover {
    // h1 + p {
    //   visibility: hidden;
    // }
    box-shadow: 0px 13px 13px 0px rgba(0, 0, 0, 0.15);
  }
  h1 + p {
    visibility: ${(props) => (props.showShadow ? 'hidden' : 'visible')};
  }
`;

export const HeaderSearchContainer = styled.div`
  background-color: ${palette.white};
  color: ${palette.coolGrey1};
  display: flex;
  padding: ${spacing.small} ${spacing.large};
  @media print {
    display: none;
  }
`;
