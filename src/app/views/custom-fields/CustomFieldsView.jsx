import React, { useCallback, useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useHistory, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
} from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';
import TaskCustomFieldsView from './TaskCustomFieldsView';
import PatientCustomFieldsView from './PatientCustomFieldsView';
import { ViewContainer } from './styled';
import UserCustomFieldsView from './UserCustomFieldsView';

const TABS = {
  0: 'patient',
  1: 'task',
  2: 'provider',
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
  const initial = Object.entries(TABS).find(([, name]) => name === tabName);

  const customerTypeLabel = getCustomerTypeLabel(userProfile);

  const [selectedTab, setSelectedTab] = useState(
    initial ? Number(initial[0]) : 0,
  );

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const applyProps = useCallback((id) => {
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
                    {customerTypeLabel} Custom Fields
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
            <Tab
              label={
                <Link to={`${CUSTOM_FIELDS_SETTINGS_PATH}/${TABS[2]}`}>
                  User Custom Fields
                </Link>
              }
              {...applyProps(1)}
            />
          </Tabs>
          <Box p={1} />
          {selectedTab === 0 && <PatientCustomFieldsView />}
          {selectedTab === 1 && <TaskCustomFieldsView editable />}
          {selectedTab === 2 && <UserCustomFieldsView editable />}
        </ViewContainer>
      </ViewLayout>
    </ColumnsConfigProvider>
  );
};

export default CustomFieldsView;
