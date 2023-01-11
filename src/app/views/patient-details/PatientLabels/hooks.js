import { useSelector, useDispatch } from 'react-redux';
import prop from 'ramda/src/prop';
import {
  addLabel,
  editLabel,
  removeLabelForPatient,
  removeLabelFromDatabase,
} from 'api/patient-label-api';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import {
  patientSelector,
  isFetchingPatientLabelsSelector,
} from 'selectors/patient-details-selectors';

const labelAddOrRemovePromise = ({
  patientIdentifier,
  currentLabelsIdentifiers,
  formattedLabelsIdentifiers,
}) => ({ labelIdentifier, labelName }) => {
  if (!labelName || labelName === null || labelName === '') {
    return Promise.resolve();
  }

  if (labelIdentifier === null) {
    return addLabel({ labelName, patientIdentifier });
  }

  if (
    !currentLabelsIdentifiers.includes(labelIdentifier) &&
    formattedLabelsIdentifiers.includes(labelIdentifier)
  ) {
    return addLabel({
      labelName,
      labelIdentifier,
      patientIdentifier,
    });
  }

  if (
    currentLabelsIdentifiers.includes(labelIdentifier) &&
    !formattedLabelsIdentifiers.includes(labelIdentifier)
  ) {
    return removeLabelForPatient({
      labelName,
      labelIdentifier,
      patientIdentifier,
    });
  }

  return Promise.resolve();
};

const useInitializeLabelsSectionHooks = () => {
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const isFetchingLabels = useSelector(isFetchingPatientLabelsSelector);

  const refreshLabels = () => {
    dispatch(PatientDetailsActions.getCurrentPatientLabels());
  };

  const refreshLabelsAndPatient = async () => {
    refreshLabels();
    dispatch(PatientDetailsActions.getCurrentPatient());
  };

  const saveAddOrRemoveLabel = async selectedLabels => {
    const currentLabels = patient?.patientLabels ?? [];
    const currentLabelsIdentifiers = currentLabels.map(prop('labelIdentifier'));

    const formattedLabels = (selectedLabels ?? []).map(
      ({ value, displayLabel }) => ({
        labelIdentifier: value,
        labelName: displayLabel,
      }),
    );

    const allLabels = [...currentLabels, ...formattedLabels];
    const formattedLabelsIdentifiers = formattedLabels.map(
      prop('labelIdentifier'),
    );
    const patientIdentifier = patient?.patientIdentifier;

    await Promise.all(
      allLabels.map(
        labelAddOrRemovePromise({
          patientIdentifier,
          currentLabelsIdentifiers,
          formattedLabelsIdentifiers,
        }),
      ),
    );

    refreshLabelsAndPatient();
  };

  const saveAddLabel = async selectedLabel => {
    const labelIdentifier = selectedLabel?.labelIdentifier;
    const labelName = selectedLabel?.labelName;
    const patientIdentifier = patient?.patientIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await addLabel({
      labelName,
      labelIdentifier,
      patientIdentifier,
    });

    refreshLabelsAndPatient();
  };

  const saveAddLabelWithNewValue = async newValue => {
    const labelIdentifier = undefined;
    const labelName = newValue;
    const patientIdentifier = patient?.patientIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await addLabel({
      labelName,
      labelIdentifier,
      patientIdentifier,
    });

    refreshLabelsAndPatient();
  };

  const saveEditLabel = async (labelIdentifier, newValue) => {
    const labelName = newValue;
    const patientIdentifier = patient?.patientIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await editLabel({
      labelName,
      labelIdentifier,
      patientIdentifier,
    });

    refreshLabelsAndPatient();
  };

  const removeLabelFromPatient = async selectedLabel => {
    const labelIdentifier = selectedLabel?.labelIdentifier;
    const labelName = selectedLabel?.labelName;
    const patientIdentifier = patient?.patientIdentifier;

    await removeLabelForPatient({
      labelName,
      labelIdentifier,
      patientIdentifier,
    });

    refreshLabelsAndPatient();
  };

  const deleteLabel = async selectedLabel => {
    const labelIdentifier = selectedLabel?.labelIdentifier;

    await removeLabelFromDatabase({
      labelIdentifier,
    });

    refreshLabelsAndPatient();
  };

  return {
    isFetchingLabels,
    saveAddOrRemoveLabel,
    saveAddLabel,
    saveAddLabelWithNewValue,
    saveEditLabel,
    removeLabelFromPatient,
    refreshLabels,
    deleteLabel,
  };
};

export default useInitializeLabelsSectionHooks;
