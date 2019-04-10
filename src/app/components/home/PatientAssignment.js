import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { addPatientToTask } from '../../actions/patient-actions';
import Patient from './Patient';
import PatientPicker from './PatientPicker';

const StyledButtonBase = styled(ButtonBase)`
  && {
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
  }
`;

const PatientAssignment = ({ patient, patients, update }) => (
  <PatientPicker assign={update} patient={patient} patients={patients}>
    {({ open }) => (
      <StyledButtonBase onClick={open}>
        {patient
          ? <Patient patient={patient} />
          : 'None'
        }
      </StyledButtonBase>
    )}
  </PatientPicker>
);

const patientShape = PropTypes.shape({
  patientId: PropTypes.number,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
});

PatientAssignment.propTypes = {
  patient: patientShape,
  patients: PropTypes.arrayOf(patientShape),
  update: PropTypes.func.isRequired,
};

PatientAssignment.defaultProps = {
  patient: null,
  patients: null,
};

const mapStateToProps = store => ({
  patients: store.patientState.allPatients,
});

const mapDispatchToProps = (dispatch, { task }) => ({
  update: (patientId) => { addPatientToTask(patientId, task.taskId)(dispatch); },
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientAssignment);
