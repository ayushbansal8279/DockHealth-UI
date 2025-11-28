/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { initializePusher } from 'helpers/pusher-instance';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import * as TaskActions from 'actions/task-actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import ProfileDetailsHeader from 'views/custom-profile-details/ProfileDetailsHeader/ProfileDetailsHeader';
import {
  ProfileDetailsContainer,
  ProfileDetailsTabsContainer,
  MainTab,
} from './styled';
import { getPatientForProfile } from '@/app/api/profile-api';
import { initializeProfileState } from '@/app/actions/profile-actions';
import { RouteWrapper } from 'routing/components';
import { DEFAULT_TABS_CONFIG, TABS_CONFIG } from './helpers';
import { profileTypeNameSelector } from '@/app/selectors/profile-selector';
import ProfileRelationship from './ProfileRelationship/ProfileRelationship';
import { getRelationshipTypes } from '@/app/api/profile-type-api';

const ProfileDetailsView = () => {
  const { profileTypeIdentifier, profileIdentifier } = useParams();
  const { patientIdentifier } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const currentProfileTypeName = useSelector(profileTypeNameSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const handleTabChange = (_, newTabValue) => {
    history.push(`${url}/${newTabValue}`);
  };

  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  useEffect(() => {
    dispatch(initializeProfileState(profileIdentifier));
  }, [dispatch, profileIdentifier]);

  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const taskCallback = ({ eventType, task, workflowIdentifier }) => {
      if (
        task?.patient &&
        task?.patient.patientIdentifier === patientIdentifier
      ) {
        if (
          eventType?.startsWith('CREATE_TASK') ||
          eventType?.startsWith('DUPLICATE_TASK')
        ) {
          dispatch(TaskActions.insertCreatedTask(task.taskIdentifier));
        } else {
          dispatch(TaskActions.refreshTask(task.taskIdentifier));
        }
      } else if (
        eventType?.startsWith('MARK_COMPLETE') &&
        !workflowIdentifier // not part of workflow
      ) {
        dispatch(TaskActions.refreshTask(task.taskIdentifier));
        if (task) {
          dispatch(TaskActions.makeTaskDisappear(task));
        }
      } else if (task?.taskIdentifier) {
        dispatch(TaskActions.refreshTask(task.taskIdentifier));
      }
    };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const taskBundleCallback = ({ eventType, taskBundle }) => {
      // eslint-disable-next-line sonarjs/no-collapsible-if
      if (
        taskBundle?.patient &&
        taskBundle?.patient.patientIdentifier === patientIdentifier &&
        (eventType?.startsWith('CREATE_TASK_BUNDLE') ||
          eventType?.startsWith('UPDATE_TASK_BUNDLE') ||
          eventType?.startsWith('DUPLICATE_TASK_BUNDLE') ||
          eventType?.startsWith('MORE_TASKS_TASK_BUNDLE')) &&
        taskBundle.identifier
      ) {
        dispatch(TaskActions.refreshTaskBundle(taskBundle.identifier));
      }
    };

    const channelName = `private-dock-user-channel-${currentUserIdentifier}`;
    let ch;

    if (currentUserIdentifier) {
      initializePusher().then((pusher) => {
        if (pusher) {
          ch = pusher?.subscribe(channelName);
          if (ch) {
            ch.bind('task-update', taskCallback);
            ch.bind('task-bundle-update', taskBundleCallback);
          }
          return () => {
            if (ch) {
              ch.unbind('task-update', taskCallback);
              ch.unbind('task-bundle-update', taskBundleCallback);
              ch.unsubscribe(channelName);
            }
          };
        }
      });
    }

    return () => {};
  }, [currentUserIdentifier, patientIdentifier, dispatch]);

  const [patients, setPatients] = useState([]);
  const [relationshipTypes, setRelationshipTypes] = useState([]);

  useEffect(() => {
    getPatientForProfile(profileIdentifier).then((patients) => {
      setPatients(patients);
    });
  }, []);

  useEffect(() => {
    getRelationshipTypes(profileTypeIdentifier).then((data) => {
      setRelationshipTypes(data);
    });
  }, [profileTypeIdentifier]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const onSearchChangedWithDebounce = useCallback(
  //   debounce((value) => {
  //     dispatch(setPatientTaskSearch(value));
  //     onSearchChanged();
  //   }, 500),
  //   [setPatientTaskSearch, onSearchChanged],
  // );

  // const handleSearchValueChange = (newValue) => {
  //   setSearchValue(newValue);
  //   onSearchChangedWithDebounce(newValue);
  // };

  // const handleFilterChange = compose(
  //   dispatch,
  //   PatientDetailsActions.changePatientTasksFilters,
  // );

  // // const handleSelectQuickFilter = useCallback(
  // //   (id, filtersSetup) => {
  // //     dispatch(selectQuickFilter(id));
  // //     dispatch(PatientDetailsActions.changePatientTasksFilters(filtersSetup));
  // //   },
  // //   [dispatch],
  // // );

  // const handleSaveAsQuickFilter = useCallback(
  //   () => dispatch(showAddQuickFilterOption()),
  //   [dispatch],
  // );

  // const wasChangedFilters = useMemo(
  //   () =>
  //     !equals(
  //       selectedFilters,
  //       quickFiltersList?.find(
  //         (f) => f.quickFilterIdentifier === selectedQuickFilter,
  //       )?.selectedOptions,
  //     ),
  //   [quickFiltersList, selectedFilters, selectedQuickFilter],
  // );

  // const handleQuickFilterCreate = useCallback(
  //   (name, scope) =>
  //     dispatch(createQuickFilter(name, { patientIdentifier }, selectedFilters, scope)),
  //   [dispatch, patientIdentifier, selectedFilters],
  // );

  // const handleQuickFilterUpdate = useCallback(
  //   (quickFilterIdentifier, name, selectedFilterOptions, scope) =>
  //     dispatch(
  //       updateQuickFilter(
  //         quickFilterIdentifier,
  //         { name, selectedOptions: selectedFilterOptions },
  //         { patientIdentifier },
  //         scope,
  //       ),
  //     ),
  //   [dispatch, patientIdentifier],
  // );

  // const handleQuickFilterDelete = useCallback(
  //   (quickFilterIdentifier) =>
  //     dispatch(deleteQuickFilter(quickFilterIdentifier)),
  //   [dispatch],
  // );

  const [tabsConfiguration, setTabsConfiguration] = useState(TABS_CONFIG);

  useEffect(() => {
    const baseTabs = [...TABS_CONFIG];

    const relationshipTabs = relationshipTypes.map((relationshipType) => ({
      label: relationshipType.name,
      mainPath: `relationships/${relationshipType.identifier}`,
      routePath: `relationships/:relationshipProfileIdentifier`,
      RouteComponent: ProfileRelationship,
      exact: true,
    }));

    setTabsConfiguration([...baseTabs, ...relationshipTabs]);
  }, [relationshipTypes, profileTypeIdentifier, profileIdentifier, history]);

  const activeTabPath = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const tab of tabsConfiguration) {
      const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
      if (regex.test(pathname)) {
        return tab.mainPath;
      }
    }
    return DEFAULT_TABS_CONFIG[0].mainPath;
  }, [pathname, tabsConfiguration]);

  return (
    <HorizontallyScrolledViewLayout
      header={
        <LayoutHeader>
          <LayoutHeader.Title
            title={currentProfileTypeName ?? 'Custom Object'}
          />
          <LayoutHeader.Spacer />
          <LayoutHeader.Spacer />
        </LayoutHeader>
      }
    >
      <ColumnsConfigProvider>
        <StickyContainer>
          <ProfileDetailsHeader />
          <ProfileDetailsTabsContainer>
            <Grid container>
              <Tabs
                value={activeTabPath}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-scrollButtons ~ .MuiTabs-scroller': {
                    px: 0,
                  },
                  '& .MuiTabs-scroller': {
                    px: 4,
                  },
                }}
              >
                {tabsConfiguration.map((t) => (
                  <MainTab
                    key={t.mainPath}
                    value={t.mainPath}
                    label={t.label}
                  />
                ))}
              </Tabs>
            </Grid>
          </ProfileDetailsTabsContainer>
        </StickyContainer>
        <ProfileDetailsContainer>
          <Switch>
            {tabsConfiguration?.map((route) => (
              <RouteWrapper
                allowedToRoles={route.allowedToRoles}
                key={route.mainPath}
                path={`${path}/${route.routePath || route.mainPath}${
                  route.additionalPath ? `/${route.additionalPath}` : ''
                }`}
                RouteComponent={route.RouteComponent}
                onEnter={route.onEnter}
                exact={route.exact}
              />
            ))}
            <Redirect to={`${path}/${DEFAULT_TABS_CONFIG[0].mainPath}`} />
          </Switch>
          {/* {currentTab === 0 && (
            <ProfileTasksListView profileIdentifier={profileIdentifier} />
          )}
          {currentTab === 1 && (
            <ProfileNotes profileIdentifier={profileIdentifier} />
          )}
          {currentTab === 2 && (
            <ProfilePatientList
              profileIdentifier={profileIdentifier}
              patients={patients}
            />
          )}
          {currentTab === 3 && (
            <ProfileAttachments profileIdentifier={profileIdentifier} />
          )} */}
        </ProfileDetailsContainer>
      </ColumnsConfigProvider>
    </HorizontallyScrolledViewLayout>
  );
};

export default ProfileDetailsView;
