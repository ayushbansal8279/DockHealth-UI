import styled from 'styled-components';
import palette from 'styles/palette';

export const UserTypeButton = styled.button`
  max-width: 160px;
  width: 100%;
  outline: none;
  
  * > * {
    font-weight: normal;
    color: ${props =>
      props.isInvited || !props.clickable || props.isInactive
        ? palette.coolGrey1
        : palette.mediumGrey}

`;

export const CurrentUserLabel = styled.div`
  display: flex;
  justify-content: flex-start;
`;
