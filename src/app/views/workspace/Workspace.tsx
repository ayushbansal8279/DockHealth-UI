import React, {  useMemo, useState } from 'react';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import {
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { RouteWrapper } from '@/app/routing/components';
import { Tabs, Grid } from '@mui/material';
import {
  WorkspaceTabsContainer,
  MainTab,
  WorkspaceDetailsContainer,
  WorkspaceTitle,
} from './styled';
import { DEFAULT_TAB, TABS_CONFIG } from './helper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const workspaceDummydata = {
  identifier: 1,
  name: "Neurology",
}

const Workspace = () => {
  const [tabsConfiguration, setTabsConfiguration] = useState(TABS_CONFIG);
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();

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
    console.log('newTabValue', newTabValue);
  };

  const renderTitle = (
    <WorkspaceTitle>
      <ArrowBackIcon
        style={{ cursor: 'pointer' }}
        onClick={() => {
          history.push('/settings/workspaces');
        }}
      />
      <div>Workspace / {workspaceDummydata.name}</div>
    </WorkspaceTitle>
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
                label={t.label}
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

export default Workspace;
