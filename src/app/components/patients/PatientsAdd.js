import ButtonBase from '@material-ui/core/ButtonBase';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { beginPatientCreation } from '../../actions/patient-actions';
import AddPatientIcon from '../../img/patients-add.svg';

const StyledButtonBase = styled(ButtonBase)`
  && {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const AddPatientIconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgb(217, 3, 107);
  box-shadow: 0 4px 8px 0 rgba(46, 58, 67, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAddPatientIcon = styled.img.attrs({
  src: AddPatientIcon,
  alt: 'Add patient',
})`
  width: 35px;
  height: 35px;
`;

const AddPatient = () => {
  const dispatch = useDispatch();
  const showPatientCreation = () => {
    dispatch(beginPatientCreation());
  };
  return (
    <StyledButtonBase onClick={showPatientCreation}>
      <AddPatientIconContainer>
        <StyledAddPatientIcon />
      </AddPatientIconContainer>
    </StyledButtonBase>
  );
};

export default AddPatient;
