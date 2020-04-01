import { IconButton, Popover } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from '../../palette';
import Search from '../taskView/Search';
import Member from './Member';

const NOT_SIGNED_UP_OPACITY = 'opacity: 0.4;';

export const useAddMemberButtonStyles = makeStyles({
  root: {
    border: `0.125rem dashed ${palette.coolGrey1}`,
    color: palette.brightBlue,
    fontSize: ({ size }) => (size * 30) / 54,
    fontWeight: '500',
    height: ({ size }) => size,
    lineHeight: 1,
    minHeight: ({ size }) => size,
    minWidth: ({ size }) => size,
    padding: 0,
    width: ({ size }) => size,
  },
});

export const AddMemberPopover = withStyles({
  paper: {
    maxWidth: '31.25rem',
    width: '31.25rem',
  },
})(Popover);

export const PopoverHeader = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  color: ${palette.white};
  display: grid;
  font-weight: 700;
  grid-template-columns: 1.625rem 1fr 1.625rem;
  grid-column-gap: 0.375rem;
  min-height: 4rem;
  padding: 1rem;
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
  grid-column-start: span 3;
`;

export const HeaderSearch = styled(Search)`
  && {
    font-weight: normal;
    width: 100%;

    > div {
      padding-right: 0.5rem;
    }
  }
`;

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
`;

export const MemberItem = styled.div`
  align-items: center;
  background: ${palette.white};
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1rem 55px 0.7fr 0.3fr 1.5rem;
  height: 4rem;
  min-height: 4rem;
  padding: 0 0.5rem;
`;

export const NoMembersElement = styled.div.attrs({
  children: 'No members found.',
})`
  align-items: center;
  display: flex;
  height: 4rem;
  justify-content: center;
  width: 100%;
`;

export const TickIconContainer = styled.div`
  height: 100%;
  ${props => props.transparent && NOT_SIGNED_UP_OPACITY}
`;

export const TickIconImage = styled.img`
  object-fit: contain;
  height: 100%;
  width: 100%;
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
  color: ${palette.unknownGrey5};
  font-size: 0.625rem;
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
  height: 5.5rem;
  padding: 0 1rem;
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
