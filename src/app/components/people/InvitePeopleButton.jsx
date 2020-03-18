import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ButtonBase } from '@material-ui/core';
import AddCrossIcon from '../../img/add-task-cross.svg';

const InvitePeopleButtonContainer = styled.div`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: center;
  margin-right: 2em;
  transition: width 0.25s ease-out;
  width: ${props => (props.inviteNew ? 44 : 220)}px;
  z-index: 2;
`;

const InvitePeopleButton = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: #d9036b;
    border-radius: 22px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    height: 44px;
    width: 100%;
  }
`;

const InvitePeopleButtonImage = styled.img`
  margin-right: 10px;
  transition: all 0.25s ease-out;
  transform: rotate(0deg);

  ${props =>
    props.inviteNew &&
    `
    margin-right: 0;
    transform: rotate(45deg);
  `}
`;

const InvitePeopleButtonLabel = styled.span`
  font-size: 20px;
  overflow: hidden;
  text-overflow: clip;
  transition: all 0.25s ease-out;
  white-space: nowrap;
`;

export default ({ inviteNew, onClick }) => {
  const [invitePeopleLabelWidth, setInvitePeopleLabelWidth] = useState(null);
  const invitePeopleLabel = useRef(null);

  useEffect(() => {
    setInvitePeopleLabelWidth(invitePeopleLabel.current.scrollWidth);
  }, []);

  return (
    <InvitePeopleButtonContainer inviteNew={inviteNew}>
      <InvitePeopleButton onClick={onClick} variant="contained">
        <InvitePeopleButtonImage inviteNew={inviteNew} src={AddCrossIcon} />
        <InvitePeopleButtonLabel
          inviteNew={inviteNew}
          width={invitePeopleLabelWidth}
          ref={invitePeopleLabel}
        >
          Invite a Person
        </InvitePeopleButtonLabel>
      </InvitePeopleButton>
    </InvitePeopleButtonContainer>
  );
};
