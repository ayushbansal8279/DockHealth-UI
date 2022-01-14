/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tabs, Grid } from '@material-ui/core';
import { compose } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import {
  useHistory,
  useRouteMatch,
  Switch,
  useLocation,
  Redirect,
  useParams,
} from 'react-router-dom';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import { initializePusher } from 'helpers/pusher-instance';
import { isFetchingPatientsListsSelector } from 'selectors/patients-selectors';
import {
  availableFiltersInInMegaFilterSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { setPatientTaskSearch } from 'sagas/patient-details-saga';
import { onSearchChanged } from 'helpers/ga-event-helper';
import { RouteWrapper } from 'routing/components';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import * as TaskActions from 'actions/task-actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { getPatientFilterOptions } from 'actions/patient-details-actions';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import { getPatientWidgets } from 'api/patient-api';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';
import {
  PatientDetailsContainer,
  PatientDetailsTabsContainer,
  MainTab,
  PatientStickyContainer,
} from './styled';
import PatientTasksList from './PatientTasksList/PatientTasksList';
import PatientNotes from './PatientNotes/PatientNotes';
import PatientAttachments from './PatientAttachments/PatientAttachments';
import PatientWidget from './PatientWidget/PatientWidget';

const TABS_CONFIG = [
  {
    label: 'All tasks',
    mainPath: 'tasks',
    additionalPath: ':taskListIdentifier?',
    RouteComponent: PatientTasksList,
    exact: true,
  },
  {
    label: 'Notes',
    mainPath: 'notes',
    RouteComponent: PatientNotes,
  },
  {
    label: 'Files',
    mainPath: 'files',
    RouteComponent: PatientAttachments,
  },
];

const DEFAULT_TAB = TABS_CONFIG[0];

const PatientDetailsView = () => {
  const { patientIdentifier } = useParams();
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const isFetchingLists = useSelector(isFetchingPatientsListsSelector);
  const filters = useSelector(availableFiltersInInMegaFilterSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);
  const pusher = useRef(initializePusher());
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  useEffect(() => {
    dispatch(PatientDetailsActions.initializePatientState(patientIdentifier));

    return () => {
      dispatch(PatientDetailsActions.clearPatientState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientIdentifier]);

  useEffect(() => {
    (async () => {
      const widgets = await getPatientWidgets();

      if (widgets && widgets.length > 0) {
        TABS_CONFIG.push({
          label: widgets[0].name,
          mainPath: `widget/${widgets[0].identifier}`,
          url: widgets[0].url,
          height: widgets[0].height,
          width: widgets[0].width,
          type: 'widget',
          RouteComponent: PatientWidget,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const callback = ({ eventType, task }) => {
      if (
        eventType?.startsWith('CREATE_TASK') ||
        eventType?.startsWith('DUPLICATE_TASK')
      ) {
        dispatch(TaskActions.insertCreatedTask(task.taskIdentifier));
      } else {
        dispatch(TaskActions.refreshTask(task.taskIdentifier));
      }
    };

    const channelName = `private-dock-user-channel-${currentUserIdentifier}`;
    let ch;

    if (currentUserIdentifier) {
      ch = pusher.current.subscribe(channelName);
      ch.bind('task-update', callback);
    }

    return () => {
      if (ch) {
        ch.unbind('task-update', callback);
        ch.unsubscribe(channelName);
      }
    };
  }, [currentUserIdentifier, dispatch]);

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

  const handleTabChange = (_, newTabValue) => {
    history.push(`${url}/${newTabValue}`);
  };

  const onSearchChangedWithDebounce = useCallback(
    debounce(value => {
      dispatch(setPatientTaskSearch(value));
      onSearchChanged();
    }, 500),
    [setPatientTaskSearch, onSearchChanged],
  );

  const handleSearchValueChange = newValue => {
    setSearchValue(newValue);
    onSearchChangedWithDebounce(newValue);
  };

  const handleFilterChange = compose(
    dispatch,
    PatientDetailsActions.changePatientTasksFilters,
  );

  return (
    <ViewLayout
      header={
        <LayoutHeader>
          <LayoutHeader.Title title={capitalize(customerTypeLabel)} />
          <LayoutHeader.Spacer />
          <HeaderSearch
            value={searchValue}
            onChange={handleSearchValueChange}
          />
          <LayoutHeader.Spacer />
          <MegaFilter
            filters={filters}
            selectedFilters={selectedFilters}
            onSelectFilters={handleFilterChange}
            isFetching={isFetchingLists}
            onOpen={() => dispatch(getPatientFilterOptions(patientIdentifier))}
          />
        </LayoutHeader>
      }
    >
      <ColumnsConfigProvider>
        <PatientStickyContainer>
          <PatientDetailsHeader />
          <PatientDetailsTabsContainer>
            <Grid container>
              <Tabs value={activeTabPath} onChange={handleTabChange}>
                {TABS_CONFIG.map(t => (
                  <MainTab
                    key={t.mainPath}
                    value={t.mainPath}
                    label={t.label}
                  />
                ))}
              </Tabs>
            </Grid>
          </PatientDetailsTabsContainer>
        </PatientStickyContainer>
        <PatientDetailsContainer>
          <Switch>
            {TABS_CONFIG?.map(route => (
              <RouteWrapper
                key={route.mainPath}
                path={`${path}/${route.mainPath}${
                  route.additionalPath ? `/${route.additionalPath}` : ''
                }`}
                RouteComponent={
                  route.type !== 'widget'
                    ? route.RouteComponent
                    : () => (
                        <PatientWidget
                          url={route.url}
                          height={route.height}
                          width={route.width}
                          identifier={route.identifier}
                        />
                      )
                }
                onEnter={route.onEnter}
                exact={route.exact}
              />
            ))}
            <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
          </Switch>
        </PatientDetailsContainer>
      </ColumnsConfigProvider>
    </ViewLayout>
  );
};

export default PatientDetailsView;
