import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setHeader } from 'actions/template-actions';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import UsersTable from './UsersTable/UsersTable';
import { UsersViewContainer, UsersViewOuterContainer } from './styled';

const UsersView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(userProfileSelector);

  useEffect(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader>Users</GenericHeader>,
            alignItems: 'center',
          },
        ],
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <UsersViewOuterContainer>
      <UsersViewContainer>
        <UsersTable />
      </UsersViewContainer>
    </UsersViewOuterContainer>
  );
};

export default UsersView;
