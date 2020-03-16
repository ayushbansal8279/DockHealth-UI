import moment from 'moment';
import { evolve } from 'ramda';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  abortPatientCreation,
  addPatient,
} from '../../actions/patient-actions';
import { capitalize, capitalizeWords } from '../../helpers/capitalize';
import { onPatientAdded } from '../../helpers/ga-event-helper';
import { showAlert } from '../../helpers/utility-functions';
import PatientsForm from './PatientsForm';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
} from './PatientsSidebar.Styled';

const validateBirthday = dob =>
  moment(dob, 'MM/DD/YYYY', true).isBefore(moment());
const validateEmail = email =>
  /^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(email);

const PatientCreation = () => {
  const dispatch = useDispatch();
  const abort = () => {
    dispatch(abortPatientCreation());
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mrn: '',
    dob: null,
    gender: '',
    phoneHome: '',
    phoneMobile: '',
    email: null,
    notes: '',
  });
  const handleInputChange = useCallback(
    event => {
      const { target } = event;
      const { name } = target;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      const updatedFormState = {
        ...formState,
        [name]: value,
      };
      const formatFormState = evolve({
        firstName: capitalizeWords,
        middleName: capitalizeWords,
        lastName: capitalizeWords,
        notes: capitalize,
      });

      setFormState(formatFormState(updatedFormState));
    },
    [formState],
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(addPatient(formState)).catch(error => {
      showAlert({
        status: 'error',
        title: 'Potential Duplicate Patient',
        text:
          error?.message ?? 'A patient with this name and MRN already exists!',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    });
    setIsSubmitting(false);
    onPatientAdded();
  }, [dispatch, formState]);

  const canSubmit = () => {
    const { firstName, lastName, dob, email } = formState;
    return (
      firstName &&
      lastName &&
      (!email || validateEmail(email)) &&
      (!dob || validateBirthday(dob))
    );
  };

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>Add a new patient</div>
        <PatientsSidebarCloseButton onClick={abort}>
          ✕
        </PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <PatientsForm
          {...formState}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isDisabled={!canSubmit() || isSubmitting}
          errors={{
            dob: formState.dob && !validateBirthday(formState.dob),
            email: formState.email && !validateEmail(formState.email),
          }}
          hideCollapse
        />
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientCreation;
