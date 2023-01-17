import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { patientSelector } from 'selectors/patient-details-selectors';
import // fetchPatientWidgets,
'sagas/patient-details-saga';
import { useBoolean } from 'hooks/useBoolean';

const useInitializeWidgetSectionHooks = () => {
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

  const [widgetsLoading] = useBoolean(false);

  return {
    userProfile,
    patient,
    // widgets,
    widgetsLoading,
  };
};

export default useInitializeWidgetSectionHooks;
