import React, { useMemo } from 'react';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { Tabs, Grid, Box } from '@mui/material';
import {
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { RouteWrapper } from '@/app/routing/components';
import ObjectsTab from './components/ObjectsTab';
import FieldLibraryTab from './components/FieldLibraryTab';
import {
  DataManagementTabsContainer,
  DataManagementDetailsContainer, 
} from './styled';

const TABS_CONFIG = [
  {
    label: 'Objects',
    mainPath: 'objects',
    RouteComponent: ObjectsTab,
  },
  {
    label: 'Field Library',
    mainPath: 'field-library',
    RouteComponent: FieldLibraryTab,
  },
];

const DEFAULT_TAB = TABS_CONFIG[0];

const DataManagement = () => {
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const activeTabPath = useMemo(() => {
    for (const tab of TABS_CONFIG) {
      const regex = new RegExp(`/${tab.mainPath}/|/${tab.mainPath}$`, 'gi');
      if (regex.test(pathname)) {
        return tab.mainPath;
      }
    }
    return DEFAULT_TAB.mainPath;
  }, [pathname, TABS_CONFIG]);

  const handleTabChange = (_, newTabValue) => {
    history.push(`${url}/${newTabValue}`);
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Data Management" />}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 32px' }}>
        <DataManagementTabsContainer>
          <Grid container>
            <Tabs value={activeTabPath} onChange={handleTabChange}>
              {TABS_CONFIG.map((t) => (
                <Box
                  key={t.mainPath}
                  component="div"
                  sx={{
                    px: 3,
                    py: 1,
                    borderBottom: t.mainPath === activeTabPath ? 2 : 0,
                    borderColor: 'primary.main',
                    cursor: 'pointer',
                    color: t.mainPath === activeTabPath ? 'primary.main' : 'text.primary',
                    fontWeight: t.mainPath === activeTabPath ? 600 : 400,
                  }}
                  onClick={() => handleTabChange(null, t.mainPath)}
                >
                  {t.label}
                </Box>
              ))}
            </Tabs>
          </Grid>
        </DataManagementTabsContainer>
        <DataManagementDetailsContainer>
          <Switch>
            {TABS_CONFIG?.map((route) => (
              <RouteWrapper
                key={route.mainPath}
                path={`${path}/${route.mainPath}`}
                RouteComponent={route.RouteComponent}
                onEnter={undefined}
                onLeave={undefined}
                exact={undefined}
              />
            ))}
            <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
          </Switch>
        </DataManagementDetailsContainer>
      </Box>
    </ViewLayout>
  );
};

export default DataManagement;
