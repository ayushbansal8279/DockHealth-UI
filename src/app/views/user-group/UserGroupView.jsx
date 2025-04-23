import { Grid } from '@mui/material';
import queryString from 'query-string';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import isNil from 'ramda/src/isNil';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import { USERS_SETTINGS_PATH } from 'routing/helpers/paths';
import { useBoolean } from 'hooks/useBoolean';
import { getCurrentUserGroupDetailsSelector } from 'selectors/user-groups-selectors';
import { selectedUserOrganizationSelector, userProfileSelector } from 'selectors/user-selectors';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import {
  checkIfUserIsOrganizationAdmin,
  isUserViewOnly,
} from 'helpers/user-helper';
import {
  setCurrentUserGroup,
  unsetCurrentUserGroup,
} from 'actions/user-groups-actions';
import { openModal } from 'modal/actions';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';

import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import PageContentHeader from 'components/common/PageContentHeader/PageContentHeader';
import AddButton, {
  AddEntitiesContainer,
} from 'components/common/AddButton/AddButton';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import LightbulbBig from 'img/lightbulb-big.svg';
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
  TaskTemplateApplicatorContainer,
  BulkEditSectionContainer,
} from './styled';
import { UserEditContext, UserEditProvider } from '@/app/context-api/user-edit-context';
import TaskTemplateApplicator from '@/app/components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import BulkEditCreateTask from '../../components/user/BulkEditSection/BulkEditCreateTask';
import BulkEditSection from '../../components/user/BulkEditSection/BulkEditSection';
import * as UsersActions from 'actions/user-actions';
import { getTaskListForUser } from '@/app/api/task-list-api';

function UserGroupView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setSearchFocused, unsetSearchFocused] =
    useBoolean(false);

  const { groupIdentifier: groupIdentifierUrlParameter } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const { users, name } = useSelector(getCurrentUserGroupDetailsSelector) || {};
  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const userContext = useContext(UserEditContext);
  const {
    selectableUsers,
    unselectAllUser,
    selectedOptions,
    selectedOptionsHandler,
  } = userContext;
  const { createTaskOption, createWorkflowOption } = selectedOptions;
  const { turnOffAllOptions } = selectedOptionsHandler;

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

  const handleSearchTermChange = (value) => {
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

  const onEditUserGroup = useCallback(() => {
    dispatch(
      openModal('AddUserToGroup', {
        userGroupIdentifier: groupIdentifier,
      }),
    );
  }, [dispatch, groupIdentifier]);

  const handleTemplateSelect = useCallback(
    (template) => {
      const assignedEntities = selectableUsers?.filter(item => item.isSelected).map(item => item.identifier);
      dispatch(
        openModal('ListPicker', {
          enableSelectingGroupStep: true,
          fetchMethod: getTaskListForUser,
          confirm: (listId, taskGroupIdentifier) =>
            dispatch(
              UsersActions.userBulkCreateWorkflow({
                workflowIdentifier: template.identifier,
                taskListIdentifier: listId,
                assignedToUsers: assignedEntities,
                taskGroupIdentifier,
              }),
            ),
        }),
      );

      unselectAllUser();
      turnOffAllOptions();
    },
    [dispatch, selectableUsers],
  );

  return (
    <>
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
                {/* <SearchInputWrapper fullWidth={isSearchFocused || searchTerm}> */}
                <SearchInput
                  value={searchTerm}
                  onValueChange={handleSearchTermChange}
                  onFocus={setSearchFocused}
                  onBlur={unsetSearchFocused}
                />
                {/* </SearchInputWrapper> */}
              </Grid>
              {groupIdentifier && groupIdentifier !== 'ALL' && (
                <AddEntitiesContainer>
                  {isOrganizationAdmin && !isViewOnly && (
                    <AddButton onClick={onEditUserGroup}>
                      Manage User Group
                    </AddButton>
                  )}
                </AddEntitiesContainer>
              )}
            </Grid>
          </PageContentHeader>
          <Grid container xs={12} item justifyContent="center">
            <Grid item xs={12} sm={12} md={8}>
              <Spacing vertical={4} />
              {isOrganizationAdmin && groupIdentifier === 'ALL' && (
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
              {isNil(users) ? (
                <ListLoaderContainer>
                  <ListSkeletonLoader header />
                </ListLoaderContainer>
              ) : (
                // <UserEditProvider>
                  <UsersList users={users} searchTerm={searchTerm} />
                // </UserEditProvider>
              )}
            </Grid>
          </Grid>
        </Grid>
      </ViewLayout>
      <BulkEditSection>
        <BulkEditSectionContainer>
          {createTaskOption && (
            <BulkEditCreateTask
              iconColorActive={iconColorActiveItem?.value}
              context={UserEditContext}
              createTaskAction={UsersActions.userBulkCreateTask}
            />
          )}
          {createWorkflowOption && (
            <TaskTemplateApplicatorContainer>
              <TaskTemplateApplicator
                onTemplateSelect={handleTemplateSelect}
                bulkApply
                iconColorActive={iconColorActiveItem?.value}
              />
            </TaskTemplateApplicatorContainer>
          )}
        </BulkEditSectionContainer>
      </BulkEditSection>
    </>
  );
}

export default UserGroupView;
