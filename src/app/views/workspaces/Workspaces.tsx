import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { TOrganization } from 'types/organization';
import { organizationSelector } from 'selectors/organization-selectors';
import { Tabs, Grid } from '@mui/material';
import {
  WorkspaceTabsContainer,
  MainTab,
  WorkspaceDetailsContainer,
} from './styled';
import { DEFAULT_TAB, TABS_CONFIG } from './helper';
import {
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { RouteWrapper } from '@/app/routing/components';
import { userHasWorkspacesFeatureSelector } from '@/app/selectors/user-selectors';

const Workspaces = () => {
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const organization = useSelector(organizationSelector) as TOrganization;

  const workspacesAvailable = useSelector(userHasWorkspacesFeatureSelector);
  if (!workspacesAvailable) {
    history.push(`/core/home`);
  }

  const activeTabPath = useMemo(() => {
    for (const tab of TABS_CONFIG) {
      const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
      if (regex.test(pathname)) {
        return tab.mainPath;
      }
    }
    return DEFAULT_TAB.mainPath;
  }, [pathname, TABS_CONFIG]);

  const handleTabChange = (_: any, newTabValue: any) => {
    history.push(`${url}/${newTabValue}`);
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Workspaces" />}>
      <WorkspaceTabsContainer>
        <Grid container>
          <Tabs value={activeTabPath} onChange={handleTabChange}>
            {TABS_CONFIG.map((t) => (
              <MainTab
                key={t.mainPath}
                value={t.mainPath}
                label={t.label}
                $isActive={t.mainPath === activeTabPath}
              />
            ))}
          </Tabs>
        </Grid>
      </WorkspaceTabsContainer>
      <WorkspaceDetailsContainer>
        <Switch>
          {TABS_CONFIG?.map((route) => (
            <RouteWrapper
              key={route.mainPath}
              path={`${path}/${route.mainPath}`}
              RouteComponent={route.RouteComponent}
              onEnter={undefined}
              onLeave={undefined}
              exact={undefined}
              allowedToRoles={undefined}
            />
          ))}
          <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
        </Switch>
      </WorkspaceDetailsContainer>
    </ViewLayout>
  );
};

export default Workspaces;

// import Loader, { LoaderSizes } from '@/app/components/common/Loader/Loader';
{
  /* <Box display="flex" justifyContent="center">
  <Loader size={LoaderSizes.medium} />
</Box>; */
}
