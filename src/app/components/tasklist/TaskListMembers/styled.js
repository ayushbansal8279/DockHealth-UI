import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const MoreMembersButtonContainer = styled.div`
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: 2px solid ${palette.coolGrey1};
  border-radius: 2.5rem;
  color: ${palette.coolGrey1};
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: ${fontWeights.bold};
`;

export const MemberWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
