import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { getAllPatients } from '../../actions/patient-actions';
import { updatePatient } from '../../actions/task-actions';
import Patient from './Patient';
import PatientPicker from './PatientPicker';

const StyledButtonBase = styled(ButtonBase)`
  && {
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
  }
`;

const PatientAssignment = ({
  patient, patients, update, fetch, isCompact,
}) => {
  useEffect(fetch, []);

  return (
    <PatientPicker assign={update} patient={patient} patients={patients}>
      {({ open }) => (
        <StyledButtonBase onClick={open}>
          {patient
            ? <Patient patient={patient} isCompact={isCompact} />
            : 'None'
        }
        </StyledButtonBase>
      )}
    </PatientPicker>
  );
};

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
  fetch: PropTypes.func.isRequired,
};

PatientAssignment.defaultProps = {
  patient: null,
  patients: null,
};

const mapStateToProps = store => ({
  patients: store.patientState.allPatients,
});

const mapDispatchToProps = (dispatch, { task }) => ({
  update: (patientId) => { updatePatient(task, { patientId })(dispatch); },
  fetch: () => { getAllPatients()(dispatch); },
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientAssignment);
