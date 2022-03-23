import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const InvitePeoplePopoverContainer = styled.div`
  background-color: ${palette.white};
  width: min-content;
`;

export const InvitePeoplePopoverSection = styled.div`
  max-width: 29rem;
  padding: 1rem;
  width: 29rem;
`;

export const InvitePopoverCloseButton = styled.button`
  color: ${palette.greyBlue};
  cursor: pointer;
  font-size: 2rem;
`;

export const InvitePopoverDivider = styled.div`
  background-color: ${palette.unknownGrey6};
  height: 0.0625rem;
  width: 100%;
`;

export const InvitePopoverHeader = styled.span`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
`;
