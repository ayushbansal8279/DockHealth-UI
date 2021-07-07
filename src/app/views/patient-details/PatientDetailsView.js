/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useMemo } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import {
  useHistory,
  useRouteMatch,
  Switch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import {
  fetchPatientTasks,
  fetchPatientFilters,
  initalizeSavedFilters,
} from 'sagas/patient-details-saga';
import { RouteWrapper } from 'routing/components';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { setHeader } from 'actions/template-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';
import { PatientDetailsContainer } from './styled';
import PatientTasksList from './PatientTasksList/PatientTasksList';

const TABS_CONFIG = [
  {
    label: 'All tasks',
    mainPath: 'tasks',
    additionalPath: ':taskListIdentifier?',
    RouteComponent: PatientTasksList,
    onEnter: ({ dispatch }) => {
      dispatch(initalizeSavedFilters());
      dispatch(fetchPatientTasks());
      dispatch(fetchPatientFilters());
    },
    exact: true,
  },
  {
    label: 'Notes',
    mainPath: 'notes',
    RouteComponent: () => <div>Notes</div>,
    onEnter: () => {},
  },
  {
    label: 'Documents',
    mainPath: 'documents',
    RouteComponent: () => <div>Documents</div>,
    onEnter: () => {},
  },
];

const DEFAULT_TAB = TABS_CONFIG[0];

const PatientDetailsView = ({ currentUser }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();

  const activeTabPath = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const tab of TABS_CONFIG) {
      const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
      if (regex.test(pathname)) {
        return tab.mainPath;
      }
    }
    return DEFAULT_TAB.mainPath;
  }, [pathname]);

  useEffect(() => {
    const customerTypeLabel = getCustomerTypeLabel(currentUser);

    dispatch(
      setHeader({
        layout: [
          {
            key: 'patients-header',
            component: (
              <>
                <GenericHeader>{capitalize(customerTypeLabel)}</GenericHeader>
              </>
            ),
          },
        ],
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (_, newTabValue) => {
    history.push(`${url}/${newTabValue}`);
  };

  return (
    <div>
      <PatientDetailsHeader />
      <Tabs value={activeTabPath} onChange={handleTabChange}>
        {TABS_CONFIG.map(t => (
          <Tab key={t.mainPath} value={t.mainPath} label={t.label} />
        ))}
      </Tabs>
      <PatientDetailsContainer>
        <Switch>
          {TABS_CONFIG?.map(route => (
            <RouteWrapper
              key={route.mainPath}
              path={`${path}/${route.mainPath}${
                route.additionalPath ? `/${route.additionalPath}` : ''
              }`}
              RouteComponent={route.RouteComponent}
              onEnter={route.onEnter}
              exact={route.exact}
            />
          ))}
          <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
        </Switch>
      </PatientDetailsContainer>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: userProfileSelector(state),
});

export default connect(mapStateToProps)(PatientDetailsView);
