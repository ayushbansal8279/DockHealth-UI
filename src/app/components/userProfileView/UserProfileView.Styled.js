import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router';
import styled from 'styled-components';

export const FormContainer = styled.form`
  &.invisible {
    display: none;
  }
`;

export const ViewContainer = styled.div`
  background-color: #fff;
  padding: 100px 0;
  position: relative;
`;

export const SectionSubtypography = styled.div`
  font-size: 16px;
`;

export const SectionTypography = styled(SectionSubtypography)`
  font-weight: bold;
`;

export const PaddedButtonLabel = styled.span`
  margin-left: 0.5rem;
`;

export const SmallButton = styled(Button)`
  && {
    align-items: center;
    background-color: #125375;
    border-radius: 0;
    color: white;
    cursor: pointer;
    display: flex;
    filter: brightness(1);
    font-size: 20px;
    font-weight: bold;
    height: 55px;
    padding: 0 1rem;
    justify-content: center;
    text-transform: initial;
    transition: filter 0.2s ease-out;
    width: 200px;

    &:hover {
      background-color: #125375;
      filter: brightness(1.25);
    }

    &[disabled] {
      cursor: progress;
      filter: brightness(0.75);
    }

    & input[type='file'] {
      height: 1px;
      position: absolute;
      left: 1px;
      opacity: 0.1;
      overflow: hidden;
      top: 1px;
      width: 1px;
    }
  }
`;

export const SubmitButton = styled(SmallButton).attrs({
  type: 'submit',
})`
  && {
    height: 75px;
    margin-top: 4rem;
    padding: 0;
    width: 100%;
  }
`;

export const FormSwitchListItem = styled(ListItem)`
  && {
    padding-right: 0;
  }
`;

export const UserAvatarGrid = styled(Grid)`
  && {
    margin-bottom: 1.5rem;
  }
`;

export const OuterAvatarContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

export const UserAvatarSupplement = styled.div`
  color: #ababb2;
  cursor: pointer;
  margin-left: 0.6rem;
  padding: 1rem;
  padding-right: 4rem;
`;

export const PlainLink = styled.a`
  color: #0ca1c7;
  font-size: 20px;
  ${props => props.topPadded && 'margin-top: 4rem;'}
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover {
    color: #0ca1c7;
    filter: brightness(1.25);
  }
`;

export const StyledLinkLabel = styled.div`
  display: inline-flex;
  font-size: 20px;
  margin-right: 0.5rem;
  margin-top: 4rem;
`;

export const StyledRouterLink = styled(Link)`
  color: #0ca1c7;
  display: inline-flex;
  font-size: 20px;
  margin-top: 4rem;
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover {
    color: #0ca1c7;
    filter: brightness(1.25);
  }
`;

export const LogoutHeaderButton = styled(Link)`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
  padding: 4px 20px;
  width: 190px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: #fff;
  }

  & > span:last-of-type {
    margin-left: 0.75rem;
  }
`;

export const UploadImagePopover = withStyles({
  paper: {
    alignItems: 'center',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    minHeight: 380,
    overflow: 'hidden',
    position: 'relative',
    width: 460,
  },
})(Popover);

export const UploadImagePopoverGrid = styled(Grid)`
  && {
    overflow: hidden;

    & > * {
      transition: all 0.2s ease-out;
    }
  }
`;

export const UploadImagePopoverLabel = styled.div`
  color: #303538;
  font-size: 20px;
`;

export const UploadImagePopoverClose = styled.div`
  color: #ababb2;
  cursor: pointer;
  font-size: 24px;
  line-height: 24px;
  top: 1rem;
  position: absolute;
  right: 1rem;
`;

export const UserProfileViewGrid = styled(Grid)`
  && {
    max-width: 780px;
  }
`;

export const LogoutButtonContainer = styled.div`
  padding-right: 2rem;
`;
