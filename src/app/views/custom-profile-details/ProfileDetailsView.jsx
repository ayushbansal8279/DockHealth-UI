/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tabs, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  useParams,
} from 'react-router-dom';
import { initializePusher } from 'helpers/pusher-instance';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import * as TaskActions from 'actions/task-actions';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import ProfileNotes from 'views/custom-profile-details/ProfileNotes/ProfileNotes';
import ProfileTasksListView from 'views/custom-profile-details/ProfileTasksList/ProfileTasksList';
import ProfileDetailsHeader from 'views/custom-profile-details/ProfileDetailsHeader/ProfileDetailsHeader';
import {
  ProfileDetailsContainer,
  ProfileDetailsTabsContainer,
  MainTab,
  HeaderContainer,
  NewDrawerContainer,
} from './styled';
import { getPatientForProfile } from '@/app/api/profile-api';
import ProfilePatientList from './ProfilePatientList/ProfilePatientList';
import useBoolean from '@/app/hooks/useBoolean';
import ProfileDetailsDrawer from '../profile-details/ProfileDetailsDrawer/ProfileDetailsDrawer';
import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';

const ProfileDetailsView = () => {
  const { profileTypeIdentifier, profileIdentifier } = useParams();
  const { patientIdentifier } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const pusher = useRef(initializePusher());
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (_, value) => {
    setCurrentTab(value);
  };
  const [isDrawerOpen, openDrawer, closeDrawer] = useBoolean(false);
  const context = "PROFILETYPE"

  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const tabsConfiguration = useMemo(
    () => [
      {
        label: 'All tasks',
        mainPath: 'tasks',
        additionalPath: ':taskListIdentifier?',
        // RouteComponent: ProfileTasksList,
        exact: true,
      },
      {
        label: 'Notes',
        mainPath: 'notes',
        // RouteComponent: ProfileNotes,
      },
    ],
    [],
  );

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
      ch = pusher.current.subscribe(channelName);
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
  }, [currentUserIdentifier, patientIdentifier, dispatch]);

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatientForProfile(profileIdentifier)
      .then(patients => {
        setPatients(patients);
      })
  }, [])

  // const activeTabPath = useMemo(() => {
  //   // eslint-disable-next-line no-restricted-syntax
  //   for (const tab of tabsConfiguration) {
  //     const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
  //     if (regex.test(pathname)) {
  //       return tab.mainPath;
  //     }
  //   }
  //   return DEFAULT_TAB.mainPath;
  // }, [pathname, tabsConfiguration]);

  // const handleTabChange = (_, newTabValue) => {
  //   history.push(`${url}/${newTabValue}`);
  // };

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

  return (
    <div style={{ display: 'flex', minHeight:"100%" }}>
      {isDrawerOpen && (
        <NewDrawerContainer>
          <ProfileDetailsDrawer context={context} closeDrawer={closeDrawer} profileTypeIdentifier={profileTypeIdentifier} profileIdentifier={profileIdentifier} />
        </NewDrawerContainer>
      )}
      <div style={{ width: '100%', height: '100%' }}>
        <HeaderContainer>
          <BasicLayoutHeader title={'Custom Profile'} />
        </HeaderContainer>
        <ColumnsConfigProvider>
          <div>
            <ProfileDetailsHeader
              openDrawer={openDrawer}
            />
            <ProfileDetailsTabsContainer>
              <Grid container>
                <Tabs value={currentTab} onChange={handleTabChange}>
                  <MainTab label="All Tasks" />
                  <MainTab label="Notes" />                  
                  {
                    patients.length > 0 &&
                      <MainTab label="Patients" />
                  }
                </Tabs>
              </Grid>
            </ProfileDetailsTabsContainer>
            <ProfileDetailsContainer>
              {currentTab === 0 && (
                <ProfileTasksListView profileIdentifier={profileIdentifier} />
              )}
              {currentTab === 1 && (
                <ProfileNotes profileIdentifier={profileIdentifier} />
              )}
              {currentTab === 2 && (
                  <ProfilePatientList profileIdentifier={profileIdentifier} patients={patients} />
              )}              
            </ProfileDetailsContainer>
          </div>
        </ColumnsConfigProvider>
      </div>
    </div>
  );
};

export default ProfileDetailsView;
