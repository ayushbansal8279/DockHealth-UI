import React, { useEffect, useMemo, useState } from 'react';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import {
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { RouteWrapper } from '@/app/routing/components';
import { Tabs, Grid, Box } from '@mui/material';
import {
  WorkspaceTabsContainer,
  MainTab,
  WorkspaceDetailsContainer,
  MoreVertIcon,
  StyledListLink,
} from './styled';
import { DEFAULT_TAB, TABS_CONFIG } from './helper';
import { workspaceSelector } from '@/app/selectors/workspace-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { clearWorkspaceState, getCurrentWorkspace } from '@/app/actions/workspace-actions';
import { Workspace as WorkspaceType } from '@/app/types/workspace';
import WorkspaceTile from '@/app/components/workspace/WorkspaceTile/WorkspaceTile';
import WorkspaceOptionsMenu from '@/app/components/workspace/WorkspaceOptionsMenu/WorkspaceOptionsMenu';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import { Flex } from '@/app/components/common/Flex/styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';

const Workspace = () => {
  const [tabsConfiguration, setTabsConfiguration] = useState(TABS_CONFIG);
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const { workspaceIdentifier } = useParams<{ workspaceIdentifier: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const workspace = useSelector(workspaceSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);
  const [menuOptionsOpen, setMenuOptionsOpen] = useState(false);
  const [renderedWorkspace, setRenderedWorkspace] =
    useState<WorkspaceType>(workspace);
  const currentUser = useSelector(userProfileSelector);    
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  useEffect(() => {
    if (workspace.workspaceIdentifier) {
      setRenderedWorkspace(workspace);
    }
  }, [workspace]);

  useEffect(() => {
    dispatch(getCurrentWorkspace(workspaceIdentifier));
  }, [workspaceIdentifier]);

  const handleNavigateHome = () => {
    dispatch(clearWorkspaceState());
    history.push(`/core/workspace`);
  };

  const activeTabPath = useMemo(() => {
    for (const tab of tabsConfiguration) {
      const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
      if (regex.test(pathname)) {
        return tab.mainPath;
      }
    }
    return DEFAULT_TAB.mainPath;
  }, [pathname, tabsConfiguration]);

  const handleTabChange = (_: any, newTabValue: any) => {
    history.push(`${url}/${newTabValue}`);
  };

  const renderTitle = (
    <Flex>
      <WorkspaceOptionsMenu
        onClose={() => setMenuOptionsOpen(false)}
        open={menuOptionsOpen}
        selectedWorkspace={renderedWorkspace}
      >
        <MoreVertIcon />
      </WorkspaceOptionsMenu>
      <WorkspaceTile
        workspaceProfileColor={renderedWorkspace.workspaceProfileColor}
        workspaceInitials={renderedWorkspace.workspaceInitials}
      />
      <Box ml={0.5}>
        <StyledListLink onClick={handleNavigateHome}>
          {workspaceLabel}
        </StyledListLink>
        {' / '}
        {renderedWorkspace.workspaceName}
      </Box>
    </Flex>
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title={renderTitle} />}>
      <WorkspaceTabsContainer>
        <Grid container>
          <Tabs value={activeTabPath} onChange={handleTabChange}>
            {tabsConfiguration.map((t) => (
              <MainTab
                key={t.mainPath}
                value={t.mainPath}
                label={
                  t.label?.trim().toLowerCase() === 'patients'
                    ? customerTypeLabel.charAt(0).toUpperCase() + customerTypeLabel.slice(1)
                    : t.label
                }
                $isActive={t.mainPath === activeTabPath}
              />
            ))}
          </Tabs>
        </Grid>
      </WorkspaceTabsContainer>
      <WorkspaceDetailsContainer>
        <Switch>
          {tabsConfiguration?.map((route) => (
            <RouteWrapper
              key={route.mainPath}
              path={`${path}/${route.mainPath}${
                route.additionalPath ? `/${route.additionalPath}` : ''
              }`}
              RouteComponent={route.RouteComponent}
              onEnter={undefined}
              onLeave={undefined}
              exact={undefined}
              allowedToRoles={undefined}
            />
          ))}
          <Redirect exact from={`${path}/patients`} to={`${path}/patients/list/all`} />
          <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
        </Switch>
      </WorkspaceDetailsContainer>
    </ViewLayout>
  );
};

export default Workspace;
