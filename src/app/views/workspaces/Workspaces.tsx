import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { Box } from '@mui/material';
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
// import Loader, { LoaderSizes } from '@/app/components/common/Loader/Loader';

const Workspaces = () => {
  const organization = useSelector(organizationSelector) as TOrganization;
  const [tabsConfiguration, setTabsConfiguration] = useState(TABS_CONFIG);
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();

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

  console.log('path', activeTabPath);

  const handleTabChange = (_: any, newTabValue: any) => {
    history.push(`${url}/${newTabValue}`);
    console.log('newTabValue', newTabValue);
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Workspaces" />}>
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
      {/* <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        Hiiii
      </Box> */}
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

export default Workspaces;

{
  /* <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
  {credentialsQuery.isLoading && (
    <Box display="flex" justifyContent="center">
      <Loader size={LoaderSizes.medium} />
    </Box>
  )}
  {credentialsQuery.data && (
    <>
      <HeaderCard credentialsExist={!!credentialsQuery.data.length} />
      {credentialsQuery.data.map((credential, idx) => (
        <ApiKeyCard key={credential.clientId} data={credential} idx={idx} />
      ))}
    </>
  )}
</Box>; */
}
