/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from 'react-router-dom';
import { isFetchingPatientsListsSelector } from 'selectors/patients-selectors';
import {
  availableFiltersInInMegaFilterSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { useBoolean } from 'hooks/useBoolean';
import {
  setPatientTaskSearch,
  patientTasksFilterChange,
} from 'sagas/patient-details-saga';
import { onSearchChanged } from 'helpers/ga-event-helper';
import { RouteWrapper } from 'routing/components';
import Spacing from 'components/common/Spacing';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import Search from 'components/task-view/Search/Search';
import { setHeader } from 'actions/template-actions';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import PatientDetailsHeader from './PatientDetailsHeader/PatientDetailsHeader';
import {
  PatientDetailsContainer,
  PatientDetailsTabsContainer,
  SearchWrapper,
  MainTab,
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
  {
    label: 'Widget',
    mainPath: 'widget',
    RouteComponent: PatientWidget,
  },
];

const DEFAULT_TAB = TABS_CONFIG[0];

const PatientDetailsView = () => {
  const [
    isSearchFocused,
    setIsSearchFocused,
    unsetIsSearchFocused,
  ] = useBoolean(false);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const isFetchingLists = useSelector(isFetchingPatientsListsSelector);
  const filters = useSelector(availableFiltersInInMegaFilterSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);

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

  useEffect(() => {
    const customerTypeLabel = getCustomerTypeLabel(currentUser);

    dispatch(
      setHeader({
        layout: [
          {
            key: 'patients-header',
            component: (
              <>
                <GenericHeader>{capitalize(customerTypeLabel)}</GenericHeader>
              </>
            ),
          },
        ],
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSearchValueChange = event => {
    const newValue = event.target?.value;
    setSearchValue(newValue);
    onSearchChangedWithDebounce(newValue);
  };

  const handleFilterChange = compose(dispatch, patientTasksFilterChange);

  return (
    <div>
      <ColumnsConfigProvider>
        <PatientDetailsHeader />
        <PatientDetailsTabsContainer>
          <Grid container justify="space-between">
            <Grid item xs={8}>
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
            {activeTabPath === 'tasks' && (
              <Grid
                container
                item
                xs={4}
                justify="flex-end"
                alignItems="center"
              >
                <MegaFilter
                  filters={filters}
                  selectedFilters={selectedFilters}
                  onSelectFilters={handleFilterChange}
                  isFetching={isFetchingLists}
                />
                <Spacing horizontal={5} />
                <SearchWrapper fullWidth={isSearchFocused || searchValue}>
                  <Search
                    fullWidth
                    noBackground
                    value={searchValue}
                    onFocus={setIsSearchFocused}
                    onBlur={unsetIsSearchFocused}
                    onChange={handleSearchValueChange}
                    placeholder={
                      isSearchFocused ? 'Search Tasks and Comments' : 'Search'
                    }
                  />
                </SearchWrapper>
              </Grid>
            )}
          </Grid>
        </PatientDetailsTabsContainer>
        <PatientDetailsContainer>
          <Switch>
            {TABS_CONFIG?.map(route => (
              <RouteWrapper
                key={route.mainPath}
                path={`${path}/${route.mainPath}${
                  route.additionalPath ? `/${route.additionalPath}` : ''
                }`}
                RouteComponent={route.RouteComponent}
                onEnter={route.onEnter}
                exact={route.exact}
              />
            ))}
            <Redirect to={`${path}/${DEFAULT_TAB.mainPath}`} />
          </Switch>
        </PatientDetailsContainer>
      </ColumnsConfigProvider>
    </div>
  );
};

export default PatientDetailsView;
