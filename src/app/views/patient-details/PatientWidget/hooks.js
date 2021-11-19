/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { patientSelector } from 'selectors/patient-details-selectors';
import {
  // fetchPatientWidgets,
} from 'sagas/patient-details-saga';
import { useBoolean } from 'hooks/useBoolean';

const initializeWidgetSectionHooks = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(userProfileSelector);
  const patient = useSelector(patientSelector);
  const patientIdentifier = patient?.patientIdentifier;

  useEffect(() => {
    if (patientIdentifier) {
      // dispatch(fetchPatientWidgets(patientIdentifier));
    }
  }, [dispatch, patientIdentifier]);

  // const widgets = useSelector(patientWidgetsSelector) || [];

  const [
    widgetsLoading,
    setWidgetsLoading,
    unsetWidgetsLoading,
  ] = useBoolean(false);

  return {
    userProfile,
    patient,
    // widgets,
    widgetsLoading,
  };
};

export default initializeWidgetSectionHooks;
