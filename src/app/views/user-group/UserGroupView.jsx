import { Grid } from '@material-ui/core';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import isNil from 'ramda/src/isNil';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import { USERS_SETTINGS_PATH } from 'routing/helpers/paths';
import { useBoolean } from 'hooks/useBoolean';
import { getCurrentUserGroupDetailsSelector } from 'selectors/user-groups-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  setCurrentUserGroup,
  unsetCurrentUserGroup,
} from 'actions/user-groups-actions';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';

import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import PageContentHeader from 'components/common/PageContentHeader/PageContentHeader';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import LightbulbBig from 'img/lightbulb-big';
import SearchInput from 'components/common/SearchInput/SearchInput';
import UsersList from './UsersList/UsersList';
import {
  ListLoaderContainer,
  ManageUsersContainer,
  HeaderMessageContainer,
  HeaderMessage,
  HeaderMessageTitle,
  HeaderMessageDescription,
  SearchInputWrapper,
} from './styled';

function UserGroupView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setSearchFocused, unsetSearchFocused] = useBoolean(
    false,
  );

  const { groupIdentifier: groupIdentifierUrlParameter } = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const { users, name } = useSelector(getCurrentUserGroupDetailsSelector) || {};
  const dispatch = useDispatch();

  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  useEffect(() => {
    dispatch(setCurrentUserGroup(groupIdentifier));

    return () => {
      dispatch(unsetCurrentUserGroup());
    };
  }, [dispatch, groupIdentifier]);

  useEffect(() => {
    const { searchName } = queryString.parse(search) ?? {};

    if (searchName) {
      setSearchTerm(searchName);
    }
  }, [search]);

  const handleSearchTermChange = value => {
    setSearchTerm(value);

    const parameters = queryString.parse(search) ?? {};
    const newParameters = {
      ...parameters,
      searchName: value,
    };

    if (!value) {
      delete newParameters.searchName;
    }

    history.replace({ search: new URLSearchParams(newParameters).toString() });
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title={name} />}>
      <Grid container justifyContent="center">
        <PageContentHeader>
          <Grid container wrap="nowrap">
            <Grid
              container
              item
              xs={6}
              xl={6}
              md={5}
              lg={4}
              justifyContent="flex-start"
            >
              <SearchInputWrapper fullWidth={isSearchFocused || searchTerm}>
                <SearchInput
                  value={searchTerm}
                  onValueChange={handleSearchTermChange}
                  onFocus={setSearchFocused}
                  onBlur={unsetSearchFocused}
                />
              </SearchInputWrapper>
            </Grid>
          </Grid>
        </PageContentHeader>
        <Grid container xs={12} item justifyContent="center">
          <Grid item xs={12} sm={12} md={8}>
            <Spacing vertical={4} />
            {isOrganizationAdmin && (
              <ManageUsersContainer>
                <Grid item xs={12} sm={12} md={8}>
                  <HeaderMessageContainer>
                    <img alt="lightbulb" src={LightbulbBig} />
                    <HeaderMessage>
                      <HeaderMessageTitle>
                        Manage people in the Subscription and Users section.
                      </HeaderMessageTitle>
                      <HeaderMessageDescription>
                        Invite, remove, and change roles for people within your
                        organization.
                      </HeaderMessageDescription>
                    </HeaderMessage>
                  </HeaderMessageContainer>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Link to={USERS_SETTINGS_PATH}>
                    <Button fullWidth>Manage Users</Button>
                  </Link>
                </Grid>
              </ManageUsersContainer>
            )}
            <Spacing vertical={4} />
            {isNil(users) ? (
              <ListLoaderContainer>
                <ListSkeletonLoader header />
              </ListLoaderContainer>
            ) : (
              <UsersList users={users} searchTerm={searchTerm} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </ViewLayout>
  );
}

export default UserGroupView;
