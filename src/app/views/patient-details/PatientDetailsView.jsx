/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tabs, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { RouteWrapper } from 'routing/components';
import * as TaskActions from 'actions/task-actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import { getPatientWidgets } from 'api/patient-api';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';
import PatientWidget from './PatientWidget/PatientWidget';
import { DEFAULT_TAB, DEFAULT_TABS_CONFIG, TABS_CONFIG } from './helpers';
import {
  PatientDetailsContainer,
  PatientDetailsTabsContainer,
  MainTab,
} from './styled';
import {
  patientOrgIdSelector,
  patientSelector,
} from '@/app/selectors/patient-details-selectors';
import { selectCurrentOrganizationWithRedirection } from '@/app/api/organization-api';
import { useIsWorkspaceScopedPatient } from '@/app/hooks/useIsWorkspaceScopedPatient';
import { getWorkspaceByIdentifier } from '@/app/api/workspace-api';
import { getWorkspaceTitle } from '../workspaces/workspace-title-helpers';
import {
  getAllProfileTypes,
  getRelationshipTypes,
} from '@/app/api/profile-type-api';
import ProfileRelationship from '../custom-profile-details/ProfileRelationship/ProfileRelationship';

const PatientDetailsView = () => {
  const { patientIdentifier } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const pusher = useRef(initializePusher());
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const patientOrgIdentifier = useSelector(patientOrgIdSelector);
  const patientNotesDisabled =
    currentOrganization?.disabledFeatures?.includes('PATIENT_NOTES') || false;

  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;

  const [tabsConfiguration, setTabsConfiguration] = useState(
    patientNotesDisabled ? DEFAULT_TABS_CONFIG : TABS_CONFIG,
  );

  const { workspaceIdentifier } = useIsWorkspaceScopedPatient();

  const [workspace, setWorkspace] = useState();
  const patient = useSelector(patientSelector);

  const isWorkspacePatient =
    patient &&
    patient?.organizationIdentifier !==
      currentOrganization?.organizationIdentifier;

  useEffect(() => {
    if (isWorkspacePatient) {
      getWorkspaceByIdentifier(patient?.organizationIdentifier).then(
        setWorkspace,
      );
    }
  }, [isWorkspacePatient, patient?.organizationIdentifier]);

  const patientTitle = getWorkspaceTitle({
    embeddedMode,
    isWorkspaceScoped: isWorkspacePatient,
    workspace,
    titleText: customerTypeLabelCapitalized,
  });

  useEffect(() => {
    if (workspaceIdentifier) {
      return;
    }
    const organizationsExist = patientOrgIdentifier && currentOrganization;
    const organizationsDiffer =
      patientOrgIdentifier !== currentOrganization?.organizationIdentifier;

    if (organizationsExist && organizationsDiffer) {
      selectCurrentOrganizationWithRedirection(
        patientOrgIdentifier,
        `#/core/patient/${patientIdentifier}`,
      );
    }
  }, [patientOrgIdentifier, currentOrganization]);

  useEffect(() => {
    dispatch(PatientDetailsActions.initializePatientState(patientIdentifier));

    return () => {
      dispatch(PatientDetailsActions.clearPatientState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientIdentifier]);

  useEffect(() => {
    (async () => {
      try {
        const baseTabs = patientNotesDisabled
          ? [...DEFAULT_TABS_CONFIG]
          : [...TABS_CONFIG];

        const profileTypes = await getAllProfileTypes('PREDEFINED');
        const patientProfileType = profileTypes.find(
          (pt) => pt.name.toLowerCase() === 'patients',
        );

        let relationshipTabs = [];
        if (patientProfileType) {
          const relationshipTypes = await getRelationshipTypes(
            patientProfileType.identifier,
          );

          const uniqueRelationshipTypes = Array.from(
            new Map(
              relationshipTypes.map((rel) => [rel.identifier, rel]),
            ).values(),
          );

          relationshipTabs = uniqueRelationshipTypes.map((rel) => ({
            label: rel.name,
            mainPath: `relationships/${rel.identifier}`,
            routePath: `relationships/:relationshipProfileIdentifier`,
            RouteComponent: ProfileRelationship,
            exact: true,
          }));
        }

        const widgetDetails = await getPatientWidgets();
        const widgets = widgetDetails?.widgets || [];

        const widgetTabs = widgets.map((w) => ({
          label: w.name,
          mainPath: `widget/${w.identifier}`,
          url: widgetDetails?.authToken
            ? `${w.url}?authToken=${widgetDetails?.authToken}&idToken=${widgetDetails?.idToken}`
            : w.url,
          height: w.height,
          width: w.width,
          type: 'widget',
          RouteComponent: PatientWidget,
        }));

        setTabsConfiguration([...baseTabs, ...widgetTabs, ...relationshipTabs]);
      } catch (err) {
        console.error('Error setting up patient tabs:', err);
      }
    })();
  }, [patientNotesDisabled]);

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

  const activeTabPath = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const tab of tabsConfiguration) {
      const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
      if (regex.test(pathname)) {
        return tab.mainPath;
      }
    }
    return DEFAULT_TAB.mainPath;
  }, [pathname, tabsConfiguration]);

  const handleTabChange = (_, newTabValue) => {
    history.push(`${url}/${newTabValue}`);
  };

  return (
    <HorizontallyScrolledViewLayout
      noOuterScroll
      header={
        <LayoutHeader>
          <LayoutHeader.Title title={patientTitle} />
        </LayoutHeader>
      }
    >
      <ColumnsConfigProvider>
        <StickyContainer>
          <PatientDetailsHeader />
          <PatientDetailsTabsContainer>
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
          </PatientDetailsTabsContainer>
        </StickyContainer>
        <PatientDetailsContainer>
          <Switch>
            {tabsConfiguration?.map((route) => (
              <RouteWrapper
                allowedToRoles={route.allowedToRoles}
                key={route.mainPath}
                path={`${path}/${route.routePath || route.mainPath}${
                  route.additionalPath ? `/${route.additionalPath}` : ''
                }`}
                RouteComponent={
                  route.type === 'widget'
                    ? () => (
                        <PatientWidget
                          url={route.url}
                          height={route.height}
                          width={route.width}
                          identifier={route.identifier}
                        />
                      )
                    : route.RouteComponent
                }
                onEnter={route.onEnter}
                exact={route.exact}
              />
            ))}
            <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
          </Switch>
        </PatientDetailsContainer>
      </ColumnsConfigProvider>
    </HorizontallyScrolledViewLayout>
  );
};

export default PatientDetailsView;
