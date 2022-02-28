import React, { useCallback, useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import { useHistory, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
} from 'selectors/user-selectors';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';
import TaskCustomFieldsView from './TaskCustomFieldsView';
import PatientCustomFieldsView from './PatientCustomFieldsView';
import { ViewContainer } from './styled';

const TABS = {
  0: 'patient',
  1: 'task',
};

const CustomFieldsView = () => {
  const userProfile = useSelector(userProfileSelector);
  const history = useHistory();
  const { tabName } = useParams();
  const patientCustomFieldsAvailable = useSelector(
    userHasPatientCustomFieldsFeatureSelector,
  );
  const taskCustomFieldsAvailable = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initial = Object.entries(TABS).find(([_, name]) => name === tabName);

  const [selectedTab, setSelectedTab] = useState(
    initial ? Number(initial[0]) : 0,
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

  const applyProps = useCallback(id => {
    return {
      id: `full-width-tab-${id}`,
      'aria-controls': `full-width-tabpanel-${id}`,
    };
  }, []);

  return (
    <ColumnsConfigProvider>
      <ViewLayout header={<BasicLayoutHeader title="Custom Fields" />}>
        <ViewContainer>
          <Tabs
            value={selectedTab}
            onChange={(_, index) => setSelectedTab(index)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            {patientCustomFieldsAvailable && (
              <Tab
                label={
                  <Link to={`${CUSTOM_FIELDS_SETTINGS_PATH}/${TABS[0]}`}>
                    Patient Custom Fields
                  </Link>
                }
                {...applyProps(0)}
              />
            )}
            {taskCustomFieldsAvailable && (
              <Tab
                label={
                  <Link to={`${CUSTOM_FIELDS_SETTINGS_PATH}/${TABS[1]}`}>
                    Task Custom Fields
                  </Link>
                }
                {...applyProps(1)}
              />
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
