import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import UsersTable from './UsersTable/UsersTable';
import { UsersViewContainer, UsersViewOuterContainer } from './styled';

const UsersView = () => {
  const history = useHistory();

  const currentUser = useSelector(userProfileSelector);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <ViewLayout header={<BasicLayoutHeader title="Users" />}>
      <UsersViewOuterContainer>
        <UsersViewContainer>
          <UsersTable />
        </UsersViewContainer>
      </UsersViewOuterContainer>
    </ViewLayout>
  );
};

export default UsersView;
