/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tabs, Grid } from '@mui/material';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
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
// import * as PatientDetailsActions from 'actions/patient-details-actions';
import { initializePusher } from 'helpers/pusher-instance';
// import { isFetchingPatientsListsSelector } from 'selectors/patients-selectors';
// import {
//   availableFiltersInInMegaFilterSelector,
//   selectedFiltersInMegaFilterSelector,
//   addQuickFilterOptionSelector,
//   quickFiltersSelector,
//   selectedQuickFilterSelector,
// } from 'selectors/mega-filter-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
// import { setPatientTaskSearch } from 'sagas/patient-details-saga';
// import { onSearchChanged } from 'helpers/ga-event-helper';
// import { RouteWrapper } from 'routing/components';
// import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import * as TaskActions from 'actions/task-actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
// import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
// import { getPatientFilterOptions } from 'actions/patient-details-actions';
// import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
// import { capitalize } from 'helpers/capitalize';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
// import {
//   showAddQuickFilterOption,
//   createQuickFilter,
//   updateQuickFilter,
//   deleteQuickFilter,
//   getQuickFilters,
//   selectQuickFilter,
// } from 'actions/mega-filter-actions';
// import ProfileTasksList from 'views/custom-profile-details/ProfileTasksList/ProfileTasksList';
import ProfileNotes from 'views/custom-profile-details/ProfileNotes/ProfileNotes';
import ProfileTasksListView from 'views/custom-profile-details/ProfileTasksList/ProfileTasksList';
import ProfileDetailsHeader from 'views/custom-profile-details/ProfileDetailsHeader/ProfileDetailsHeader';
// import ProfileWidget from 'views/custom-profile-details/ProfileWidget/ProfileWidget';
// import { DEFAULT_TAB, DEFAULT_TABS_CONFIG, TABS_CONFIG } from './helpers';
import {
  ProfileDetailsContainer,
  ProfileDetailsTabsContainer,
  MainTab,
} from './styled';

const ProfileDetailsView = () => {
  const { profileTypeIdentifier, profileIdentifier } = useParams();
  const { patientIdentifier } = useParams();
  // const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  // const isFetchingLists = useSelector(isFetchingPatientsListsSelector);
  // const filters = useSelector(availableFiltersInInMegaFilterSelector);
  // const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);
  const pusher = useRef(initializePusher());
  // const customerTypeLabel = getCustomerTypeLabel(currentUser);
  // const quickFiltersList = useSelector(quickFiltersSelector);
  // const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  // const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (_, value) => {
    setCurrentTab(value);
  };

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  // const patientNotesDisabled =
  //   currentOrganization?.disabledFeatures?.includes('PATIENT_NOTES') || false;

  // const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;

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

  // useEffect(() => {
  //   dispatch(PatientDetailsActions.initializePatientState(patientIdentifier));

  //   return () => {
  //     dispatch(PatientDetailsActions.clearPatientState());
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [patientIdentifier]);

  // useEffect(() => {
  //   (async () => {
  //     const widgetDetails = await getPatientWidgets();
  //     const widgets = widgetDetails?.widgets;
  //
  //     const widgetTabs = [];
  //
  //     if (widgets && widgets.length > 0) {
  //       widgetTabs.push({
  //         label: widgets[0].name,
  //         mainPath: `widget/${widgets[0].identifier}`,
  //         url: widgetDetails?.authToken
  //           ? `${widgets[0].url}?authToken=${widgetDetails?.authToken}&idToken=${widgetDetails?.idToken}`
  //           : widgets[0].url,
  //         height: widgets[0].height,
  //         width: widgets[0].width,
  //         type: 'widget',
  //         RouteComponent: ProfileWidget,
  //       });
  //
  //       setTabsConfiguration([...tabsConfiguration, ...widgetTabs]);
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  // const handleSaveQuickFilter = useCallback(
  //   () =>
  //     dispatch(
  //       updateQuickFilter(
  //         selectedQuickFilter,
  //         {
  //           selectedOptions: selectedFilters,
  //         },
  //         { patientIdentifier },
  //       ),
  //     ),
  //   [dispatch, patientIdentifier, selectedFilters, selectedQuickFilter],
  // );

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
  //   (name) =>
  //     dispatch(createQuickFilter(name, { patientIdentifier }, selectedFilters)),
  //   [dispatch, patientIdentifier, selectedFilters],
  // );

  // const handleQuickFilterUpdate = useCallback(
  //   (quickFilterIdentifier, name) =>
  //     dispatch(
  //       updateQuickFilter(
  //         quickFilterIdentifier,
  //         { name },
  //         { patientIdentifier },
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
    <HorizontallyScrolledViewLayout
      header={
        <LayoutHeader>
          <LayoutHeader.Title title="Custom Profile" />
          <LayoutHeader.Spacer />
          {/* HERE: */}
          {/* <HeaderSearch */}
          {/*   value={searchValue} */}
          {/*   onChange={handleSearchValueChange} */}
          {/* /> */}
          <LayoutHeader.Spacer />
          {/* HERE */}
          {/* <MegaFilter */}
          {/*   filters={filters} */}
          {/*   selectedFilters={selectedFilters} */}
          {/*   onSelectFilters={handleFilterChange} */}
          {/*   isFetching={isFetchingLists} */}
          {/*   onOpen={() => { */}
          {/*     dispatch(getQuickFilters({ patientIdentifier })); */}
          {/*     dispatch(getPatientFilterOptions(patientIdentifier)); */}
          {/*   }} */}
          {/*   quickFiltersList={quickFiltersList} */}
          {/*   addQuickFilterOption={addQuickFilterOption} */}
          {/*   selectedQuickFilter={selectedQuickFilter} */}
          {/*   selectQuickFilter={handleSelectQuickFilter} */}
          {/*   onSaveClick={handleSaveQuickFilter} */}
          {/*   onSaveAsNewClick={handleSaveAsQuickFilter} */}
          {/*   wasChangedFilters={wasChangedFilters} */}
          {/*   onQuickFilterCreate={handleQuickFilterCreate} */}
          {/*   onQuickFilterUpdate={handleQuickFilterUpdate} */}
          {/*   onQuickFilterDelete={handleQuickFilterDelete} */}
          {/* /> */}
        </LayoutHeader>
      }
    >
      <ColumnsConfigProvider>
        <StickyContainer>
          <ProfileDetailsHeader
          // onViewDetailsClick={handleDrawerOpen}
          />
          <ProfileDetailsTabsContainer>
            <Grid container>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <MainTab label="All Tasks" />
                <MainTab label="Notes" />
              </Tabs>
            </Grid>
          </ProfileDetailsTabsContainer>
        </StickyContainer>
        <ProfileDetailsContainer>
          {/* <Switch> */}
          {/*   {tabsConfiguration?.map((route) => ( */}
          {/*     <RouteWrapper */}
          {/*       allowedToRoles={route.allowedToRoles} */}
          {/*       key={route.mainPath} */}
          {/*       path={`${path}/${route.mainPath}${ */}
          {/*         route.additionalPath ? `/${route.additionalPath}` : '' */}
          {/*       }`} */}
          {/*       RouteComponent={ */}
          {/*         route.type === 'widget' */}
          {/*           ? () => ( */}
          {/*               <ProfileWidget */}
          {/*                 url={route.url} */}
          {/*                 height={route.height} */}
          {/*                 width={route.width} */}
          {/*                 identifier={route.identifier} */}
          {/*               /> */}
          {/*             ) */}
          {/*           : route.RouteComponent */}
          {/*       } */}
          {/*       onEnter={route.onEnter} */}
          {/*       exact={route.exact} */}
          {/*     /> */}
          {/*   ))} */}
          {/*   <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} /> */}
          {/* </Switch> */}
          {currentTab === 0 && (
            <ProfileTasksListView profileIdentifier={profileIdentifier} />
          )}
          {currentTab === 1 && (
            <ProfileNotes profileIdentifier={profileIdentifier} />
          )}
        </ProfileDetailsContainer>
      </ColumnsConfigProvider>
    </HorizontallyScrolledViewLayout>
  );
};

export default ProfileDetailsView;
