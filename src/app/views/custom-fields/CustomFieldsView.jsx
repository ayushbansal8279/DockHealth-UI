import React, { useCallback, useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
} from 'selectors/user-selectors';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import TaskCustomFieldsView from './TaskCustomFieldsView';
import PatientCustomFieldsView from './PatientCustomFieldsView';
import { ViewContainer } from './styled';

const CustomFieldsView = () => {
  const userProfile = useSelector(userProfileSelector);
  const history = useHistory();

  const patientCustomFieldsAvailable = useSelector(
    userHasPatientCustomFieldsFeatureSelector,
  );
  const taskCustomFieldsAvailable = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );

  const [selectedTab, setSelectedTab] = useState(
    taskCustomFieldsAvailable ? 1 : 0,
  );

  useEffect(() => {
    if (
      !(
        userProfile?.orgUserRole === 'OWNER' ||
        userProfile?.orgUserRole === 'ADMIN'
      )
    ) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const applyProps = useCallback(index => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }, []);

  return (
    <ColumnsConfigProvider>
      <ViewLayout header={<BasicLayoutHeader title="Custom Fields" />}>
        <ViewContainer>
          <Tabs
            value={selectedTab}
            onChange={(event, index) => setSelectedTab(index)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            {patientCustomFieldsAvailable && (
              <Tab label="Patient Custom Fields" {...applyProps(0)} />
            )}
            {taskCustomFieldsAvailable && (
              <Tab label="Task Custom Fields" {...applyProps(1)} />
            )}
          </Tabs>
          <Box p={1} />
          {selectedTab === 0 && <PatientCustomFieldsView />}
          {selectedTab === 1 && <TaskCustomFieldsView editable />}
        </ViewContainer>
      </ViewLayout>
    </ColumnsConfigProvider>
  );
};

export default CustomFieldsView;
