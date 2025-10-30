import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import TaskCustomFieldsView from '../TaskCustomFieldsView';
import { ViewContainer } from '../styled';

const TaskCustomizationsView = () => {
  const userProfile = useSelector(userProfileSelector);
  const history = useHistory();

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  return (
    <ColumnsConfigProvider>
      <ViewLayout header={<BasicLayoutHeader title="Task Settings" />}>
        <ViewContainer>
          <Box p={1} />
          <TaskCustomFieldsView editable fullWidth />
        </ViewContainer>
      </ViewLayout>
    </ColumnsConfigProvider>
  );
};

export default TaskCustomizationsView;
