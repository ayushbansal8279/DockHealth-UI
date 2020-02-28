import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import withStyles from '@material-ui/core/styles/withStyles';
import styled from 'styled-components';
import Member from './Member';

const NOT_SIGNED_UP_OPACITY = 'opacity: 0.6;';

export const AddMemberButton = withStyles({
  root: {
    border: '0.684px dashed #0ca1c7',
    fontSize: '2.5rem',
    fontWeight: '300',
    height: 54,
    minHeight: 54,
    minWidth: 54,
    padding: 0,
    width: 54,
  },
})(IconButton);

export const AddMemberPopover = withStyles({
  paper: {
    maxWidth: '31.25rem',
    width: '31.25rem',
  },
})(Popover);

export const PopoverHeader = styled.div`
  align-items: center;
  background-color: #2a4a70;
  color: #fff;
  font-weight: 700;
  display: flex;
  padding: 1rem;
  width: 100%;
`;

export const PopoverHeaderCloseButton = withStyles({
  root: {
    color: '#fff',
    fontSize: '1.5rem',
    height: '1.5rem',
    lineHeight: 1,
    marginRight: '0.375rem',
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
  background: #fff;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1rem 55px 0.7fr 0.3fr 1.5rem;
  height: 4rem;
  min-height: 4rem;
  padding: 0 0.5rem;
`;

export const TickIconContainer = styled.div`
  height: 100%;
  ${props => !props.isSignedUp && NOT_SIGNED_UP_OPACITY}
`;

export const TickIconImage = styled.img`
  object-fit: contain;
  height: 100%;
  width: 100%;
`;

export const StyledMember = styled(Member)`
  && {
    ${props => !props.isSignedUp && NOT_SIGNED_UP_OPACITY}
  }
`;

export const MemberName = styled.div`
  color: #2e3a43;
  font-size: 1rem;
  ${props => !props.isSignedUp && NOT_SIGNED_UP_OPACITY}
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
  color: #ababb2;
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
  background-color: #e0e0e0;
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
  color: #007cab;
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
