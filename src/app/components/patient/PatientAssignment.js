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

const StyledText = styled.span`
  color: #aab8c3;
  display: block;
  font-size: 16px;
  font-style: italic;
  ${props =>
    props.padded &&
    `
    align-items: center;
    display: flex;
    height: 32px;
  `}
`;

const PatientAssignment = ({
  patient,
  patients,
  update,
  fetch,
  isCompact,
  disabled,
  task,
}) => {
  useEffect(fetch, []);

  const { parentTaskIdentifier } = task;

  const patientComponent = ({ padded }) =>
    patient ? (
      <Patient patient={patient} isCompact={isCompact} padded={padded} />
    ) : (
      <StyledText padded={padded}>None</StyledText>
    );

  if (disabled || parentTaskIdentifier) {
    return patientComponent({ padded: true });
  }

  return (
    <PatientPicker assign={update} patient={patient} patients={patients}>
      {({ open }) => (
        <StyledButtonBase onClick={open}>
          {patientComponent({ padded: false })}
        </StyledButtonBase>
      )}
    </PatientPicker>
  );
};

const patientShape = PropTypes.shape({
  patientIdentifier: PropTypes.number,
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
  update: patientIdentifier => {
    updatePatient(task, { patientIdentifier })(dispatch);
  },
  fetch: () => {
    getAllPatients()(dispatch);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientAssignment);
