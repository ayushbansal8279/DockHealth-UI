import styled from 'styled-components';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router';

export const FormContainer = styled.form`
  &.invisible {
    display: none;
  }
`;

export const ViewContainer = styled.div`
  margin: 100px 0;
  position: relative;
`;

export const SectionSubtypography = styled.div`
  font-size: 14px;
`;

export const SectionTypography = styled(SectionSubtypography)`
  font-weight: bold;
`;

export const SubmitButton = styled.button.attrs({
  type: 'submit',
})`
  align-items: center;
  background-color: #125375;
  border-radius: 0;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  font-weight: bold;
  height: 75px;
  justify-content: center;
  margin-top: 4rem;
  transition: filter 0.2s ease-out;
  width: 100%;

  &[disabled] {
    cursor: progress;
    filter: brightness(0.75);
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

export const AvatarContainer = styled.div`
  align-items: center;
  background-color: #fff;
  border: 2px solid #007cab;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: inline-flex;
  height: 90px;
  padding: 6px;
  justify-content: center;
  position: relative;
  width: 90px;
`;

export const InnerAvatarContainer = styled.div`
  align-items: center;
  background-color: #007cab;
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 2rem;
  font-weight: bold;
  justify-content: center;
  line-height: 1;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  width: 100%;
`;

export const AvatarImageContainer = styled.img`
  height: 100%;
  width: 100%;
`;

export const CameraContainer = styled.div`
  align-items: center;
  background-color: #fff;
  border: 2px solid #007cab;
  border-radius: 50%;
  display: flex;
  height: 40px;
  justify-content: center;
  left: 90%;
  position: absolute;
  top: 15%;
  transform: translate(-50%, -50%);
  width: 40px;
`;

export const UserAvatarSupplement = styled.div`
  color: #ababb2;
  cursor: default;
  margin-left: 1.5rem;
`;

export const PlainLink = styled.a`
  color: #0ca1c7;
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
