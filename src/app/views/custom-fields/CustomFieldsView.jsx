import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import TaskCustomFieldsView from './TaskCustomFieldsView';
import PatientCustomFieldsView from './PatientCustomFieldsView';
import { ViewContainer } from './styled';
import UserCustomFieldsView from './UserCustomFieldsView';
import ProfilesCustomFieldsView from './ProfilesCustomFieldView';

const TABS = {
  0: 'patients',
  1: 'task',
  2: 'users',
};

const CustomFieldsView = () => {
  const userProfile = useSelector(userProfileSelector);
  const history = useHistory();
  const { tabName, identifier } = useParams();

  const initial = Object.entries(TABS).find(([, name]) => name === tabName);

  const [selectedTab] = useState(initial ? Number(initial[0]) : null);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  return (
    <ColumnsConfigProvider>
      <ViewLayout
        header={
          <BasicLayoutHeader
            title={`${
              tabName
                ? tabName?.charAt(0).toUpperCase() + tabName?.slice(1)
                : ''
            } Custom Fields`}
          />
        }
      >
        <ViewContainer>
          <Box p={1} />
          {selectedTab === 0 && <PatientCustomFieldsView />}
          {selectedTab === 1 && <TaskCustomFieldsView editable />}
          {selectedTab === 2 && <UserCustomFieldsView editable />}
          {!selectedTab && selectedTab !== 0 && (
            <ProfilesCustomFieldsView
              editable
              profileTypeIdentifier={identifier}
            />
          )}
        </ViewContainer>
      </ViewLayout>
    </ColumnsConfigProvider>
  );
};

export default CustomFieldsView;
