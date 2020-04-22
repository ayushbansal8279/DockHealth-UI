import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import ChangePhoneNumberForm from 'components/auth/ChangePhoneNumberForm';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const ChangePhoneNumber = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  });

  return <ChangePhoneNumberForm />;
};

export default ChangePhoneNumber;
