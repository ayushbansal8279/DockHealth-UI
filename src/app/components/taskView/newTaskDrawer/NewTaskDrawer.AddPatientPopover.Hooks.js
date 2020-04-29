/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';

import { addPatient, getAllPatients } from 'actions/patient-actions';
import useBoolean from 'hooks/useBoolean';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
});

const initializeAddPatientPopoverHooks = ({
  closePopover,
  initialValue,
  isPopoverOpen,
  setParentFormValue,
}) => {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const [isAdding, setAdding, unsetAdding] = useBoolean(false);

  const dispatch = useDispatch();

  const { setValue } = formMethods;

  const onSubmit = useCallback(
    data => {
      setAdding();

      addPatient(data)(dispatch)
        .then(async response => {
          await getAllPatients()(dispatch);

          setParentFormValue('patientIdentifier', response?.patientIdentifier);
          closePopover();
          unsetAdding();
        })
        .catch(() => {
          unsetAdding();
        });
    },
    [closePopover, dispatch, setAdding, setParentFormValue, unsetAdding],
  );

  useEffect(() => {
    if (isPopoverOpen) {
      const [firstName, ...otherNames] = initialValue.split(' ');

      // requestAnimationFrame is used in here due to form not being ready to accept values on first
      // component render
      requestAnimationFrame(() => {
        setValue('firstName', firstName);
        setValue('lastName', otherNames.join(' '));
      });
    }
  }, [initialValue, isPopoverOpen, setValue]);

  return {
    formMethods,
    onSubmit,
    isAdding,
  };
};

export default initializeAddPatientPopoverHooks;
