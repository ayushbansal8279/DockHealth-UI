/* eslint-disable react-hooks/rules-of-hooks */
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { object, string } from 'yup';

const REQUIRED_FIELD = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_FIELD),
  lastName: string().required(REQUIRED_FIELD),
  email: string().required(REQUIRED_FIELD),
});

const initializeInviteFormHooks = initialValues => {
  const dispatch = useDispatch();
  const formContext = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
    defaultValues: initialValues,
  });

  const { handleSubmit } = formContext;
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  return {
    dispatch,
    currentUser,
    formContext,
    handleSubmit,
  };
};

export default initializeInviteFormHooks;
