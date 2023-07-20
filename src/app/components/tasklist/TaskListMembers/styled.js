import styled from 'styled-components';

export const MemberWrapper = styled.div`
  display: flex;
  flex-direction: row;

  ${({ isPending }) => isPending && `opacity: 0.7;`}
`;
