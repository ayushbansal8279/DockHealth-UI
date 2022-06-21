import { Grid, IconButton, Popover } from '@material-ui/core';
import queryString from 'query-string';
import React, { useEffect, useState, useCallback } from 'react';
import Draggable from 'react-draggable';
import { isNil } from 'ramda';
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
import ChatIcon from '@material-ui/icons/Chat';
import GroupChannelContainer from 'views/chat/group-channel/GroupChannelContainer';
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
  const [open, setOpen, unsetOpen] = useBoolean(false);

  const [anchorElement, setAnchorElement] = useState(null);

  const handleClick = event => {
    setOpen();
    setAnchorElement(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    unsetOpen();
    setAnchorElement(null);
  }, [unsetOpen]);

  const id = open ? 'simple-popover' : undefined;

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
      <Grid container justify="center">
        <PageContentHeader>
          <Grid container wrap="nowrap">
            <Grid item xs={6} xl={6} md={5} lg={4} justify="flex-start">
              <SearchInputWrapper fullWidth={isSearchFocused || searchTerm}>
                <SearchInput
                  value={searchTerm}
                  onValueChange={handleSearchTermChange}
                  onFocus={setSearchFocused}
                  onBlur={unsetSearchFocused}
                />
              </SearchInputWrapper>
            </Grid>
            <Grid container xs={8} xl={8} md={8} lg={8} justify="flex-end">
              <IconButton
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                <ChatIcon />
              </IconButton>
              {/* make class handle */}
              <Draggable handle=".handle">
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorElement}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 50,
                    horizontal: 600,
                  }}
                  onClose={handleClose}
                >
                  <GroupChannelContainer
                    identifier={currentUser.identifier}
                    name={currentUser.name}
                    channelUrl="sendbird_group_channel_140571109_e686fc399df276dcda6e240337836d33c4c79397"
                  />
                </Popover>
              </Draggable>
            </Grid>
          </Grid>
        </PageContentHeader>
        <Grid container xs={12} item justify="center">
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
