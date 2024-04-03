import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { success } from 'actions/notification-actions';

export const useSuccessLogin = () => {
  const history = useHistory();

  const successLogin = useCallback(() => {
    const nextPathname = sessionStorage.getItem('next-page');
    if (nextPathname && nextPathname !== '') {
      sessionStorage.removeItem('next-page');
      history.push(nextPathname);
    } else {
      history.push('/core/home/my-tasks');
    }

    success('Logged in.');
  }, []);

  return successLogin;
};
