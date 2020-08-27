import { IconButton, Popover } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import styled from 'styled-components';
import palette from 'styles/palette';
import Search from 'components/taskView/Search/Search';
import spacing from 'styles/spacing';
import Member from '../Member';

const NOT_SIGNED_UP_OPACITY = 'opacity: 0.4;';

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${spacing.giga} 0;
`;

export const AddMemberPopover = withStyles({
  paper: {
    border: 0,
    height: '31rem',
    maxWidth: '31.25rem',
    width: '31.25rem',
  },
})(Popover);

export const MemberActionsPopover = withStyles({
  paper: {
    border: 0,
    borderRadius: '0.25rem',
  },
})(Popover);

export const PopoverHeader = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  color: ${palette.white};
  display: grid;
  font-size: 1.125rem;
  font-weight: 700;
  grid-template-columns: ${props =>
    props.hasCloseButton ? '1fr 1.625rem' : '1.625rem 1fr'};
  grid-column-gap: 0.375rem;
  min-height: 2.875rem;
  padding: 0.75rem 0.5rem;
  width: 100%;
`;

export const PopoverHeaderCloseButton = withStyles({
  root: {
    color: palette.white,
    fontSize: '1.5rem',
    height: '1.5rem',
    lineHeight: 1,
    padding: 0,
    width: '1.5rem',
  },
})(IconButton);

export const HeaderSearchContainer = styled.div`
  border-bottom: 0.25rem solid ${palette.midnightBlue};
  width: 100%;

  && * {
    font-family: 'Montserrat', sans-serif;
  }
`;

export const HeaderSearch = styled(Search)``;

export const HeaderSearchButton = withStyles({
  root: {
    height: '1.5rem',
    lineHeight: 1,
    padding: 0,
    width: '1.5rem',
  },
})(IconButton);

export const MembersContainer = styled.div`
  min-height: 4rem;
  margin: 0.5rem;
  max-height: 20rem;
  overflow-y: auto;
  scrollbar-color: ${palette.scrollbarGrey} ${palette.coolGrey4};

  &::-webkit-scrollbar {
    background: ${palette.coolGrey4};
    border-radius: 1rem;
    padding: 0.125rem;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.scrollbarGrey};
    border-radius: 1rem;
  }
`;

export const MemberItem = styled.div`
  align-items: center;
  background: ${palette.white};
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: 1fr auto;
  height: 4rem;
  min-height: 4rem;
  padding: 0 0.5rem;
`;

export const MemberInnerItem = styled.div`
  align-items: center;
  cursor: ${props => (props.isCurrentUser ? 'not-allowed' : 'pointer')};
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: 1.25rem 40px 1fr;
`;

export const NoMembersElement = styled.div`
  align-items: center;
  display: flex;
  height: 4rem;
  justify-content: center;
  width: 100%;
`;

export const TickIconContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;

  & svg {
    object-fit: contain;
    width: 100%;
  }
`;

export const StyledMember = styled(Member)`
  && {
    ${props => props.transparent && NOT_SIGNED_UP_OPACITY}
  }
`;

export const MemberName = styled.div`
  color: ${palette.greyBlue};
  font-size: 1rem;
  ${props => props.transparent && NOT_SIGNED_UP_OPACITY}
  position: relative;
`;

export const NotSignedUpLabel = styled.div`
  bottom: 0;
  font-size: 0.625rem;
  left: 0;
  position: absolute;
  transform: translateY(100%);
`;

export const MemberRole = styled.div`
  align-items: center;
  background-color: ${props =>
    props.invitationPending ? palette.coolGrey3 : palette.coolGrey2};
  color: ${props =>
    props.invitationPending ? palette.coolGrey2 : palette.white};
  cursor: ${props => (props.isCurrentUser ? 'not-allowed' : 'pointer')};
  display: flex;
  font-size: 0.875rem;
  height: 2rem;
  justify-content: center;
  text-transform: uppercase;
  width: 6.375rem;
`;

export const MoreIconButton = withStyles({
  root: {
    height: '1.5rem',
    padding: 0,
    width: '1.5rem',
  },
})(IconButton);

export const PopoverDivider = styled.div`
  background-color: ${palette.coolGrey3};
  height: 0.0625rem;
  width: 100%;
`;

export const PopoverBottomSection = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  min-height: 3rem;
  padding: 0.75rem 1rem;
`;

export const InviteLink = styled.span`
  color: ${palette.cyanBlue};
  cursor: pointer;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    filter: brightness(1.25);
  }
`;

export const FormSection = styled.div`
  padding: 1rem;

  > *:not(:first-child) {
    margin-top: 0.5rem;
  }
`;
