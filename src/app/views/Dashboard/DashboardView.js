import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import { isEmpty } from 'ramda';
import Confetti from 'react-confetti';
import MenuIcon from 'img/menu-icon';
import { dashboardTasksIsLoadingSelector } from 'selectors/dashboard-tasks-selectors';
import { listsSelector } from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TemplateActions from 'actions/template-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as TaskListSagaActions from 'sagas/tasklist-saga';
import * as UserApi from 'api/user-api';
import Spacing from 'components/common/Spacing';
import { openModal as openModalAction } from 'modal/actions';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
import {
  DashboardViewWrapper,
  DashboardSidebarWrapper,
  DashboardContentWrapper,
  DashboardHeaderContainer,
  MenuButton,
  DashboardFirstVisitViewWrapper,
  DashboardScrollableList,
} from './styled';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import existingUserTourHooks from './existing-user-tour-hooks';

const DashboardView = ({
  isTaskDrawerOpen,
  isLoadingDashboard,
  lists = [],
  pendingLists = [],
  showNavbar,
  currentUser,
  openModal,
  setTaskListAsCurrentList,
  fetchTasklistForUser,
  acceptInviteToTaskList,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [
    isFirstUserListCreationSuccess,
    setIsFirstUserListCreationSuccess,
  ] = useState(false);

  const currentUserLoaded = currentUser && !isEmpty(currentUser);
  const { usageState } = currentUser ?? {};
  const { hasExistingLists, hasOnlyInvitedLists } = usageState ?? {};

  const createListViewVisible = !hasExistingLists || hasOnlyInvitedLists;
  const firstUserList = lists?.find(list => list.listType !== 'INBOX');

  const shouldHideSidebar = isTaskDrawerOpen && window.innerWidth < 1920;

  const refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      UserApi.refreshAccessToken(user.username);
      refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  };

  useMount(() => {
    refreshAccessToken(currentUser);
  });

  const allLists = useMemo(() => [...pendingLists, ...lists], [
    lists,
    pendingLists,
  ]);

  const handleCreateList = () => {
    setTaskListAsCurrentList(null);
    openModal('CreateList', {
      test: 'test',
      onClose: () => {
        fetchTasklistForUser();
        UserApi.getUserByEmail(currentUser.email, currentUser);
      },
      onListCreationSuccess: () => {
        setIsFirstUserListCreationSuccess(true);
      },
    });
  };

  const { renderExistingUserTour } = existingUserTourHooks({
    isLoadingDashboard,
    createListViewVisible,
    currentUserLoaded,
    lists,
  });

  return (
    <DashboardViewWrapper>
      <ViewLoader isFetchingData={!currentUserLoaded}>
        <>
          {hasExistingLists && (
            <DashboardSidebarWrapper isHidden={shouldHideSidebar}>
              <DashboardSidebar
                shouldDisplayFirstListCreationMessage={
                  isFirstUserListCreationSuccess
                }
                lists={allLists}
                showNavbar={showNavbar}
                closeListCreationSuccessMessage={() =>
                  setIsFirstUserListCreationSuccess(false)
                }
                acceptInvitation={acceptInviteToTaskList}
              />
            </DashboardSidebarWrapper>
          )}
          <DashboardContentWrapper
            fullWidth={createListViewVisible}
            hasRightPadding={shouldHideSidebar}
          >
            {hasExistingLists && isFirstUserListCreationSuccess && (
              <Confetti style={{ zIndex: 101 }} numberOfPieces={700} />
            )}
            <DashboardScrollableList>
              <DashboardHeaderContainer>
                {!hasExistingLists && (
                  <MenuButton onClick={showNavbar}>
                    <img src={MenuIcon} alt="menu" />
                  </MenuButton>
                )}
                <DashboardHeader
                  isUserFirstTime={
                    createListViewVisible || isFirstUserListCreationSuccess
                  }
                  currentUser={currentUser}
                />
              </DashboardHeaderContainer>
              <Spacing vertical={3} />
              {createListViewVisible ? (
                <DashboardFirstVisitViewWrapper>
                  <DashboardFirstVisitView
                    hasInvitedLists={hasOnlyInvitedLists}
                    onCreateList={handleCreateList}
                    onTakeATour={() =>
                      openModal('Video', {
                        title: 'Emailing a Task to Dock Health',
                        url: 'https://www.youtube.com/embed/FlScR9Rjq1E',
                      })
                    }
                    list={firstUserList}
                  />
                </DashboardFirstVisitViewWrapper>
              ) : (
                <DashboardList
                  currentUser={currentUser}
                  isTaskDrawerOpen={isTaskDrawerOpen}
                />
              )}
            </DashboardScrollableList>
          </DashboardContentWrapper>
          {renderExistingUserTour()}
        </>
      </ViewLoader>
    </DashboardViewWrapper>
  );
};

const mapStateToProps = state => ({
  lists: listsSelector(state),
  pendingLists: state.invitationState.pendingTasklists,
  isTaskDrawerOpen: state.taskDrawerState.open,
  isLoadingDashboard: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
});

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
  openModal: openModalAction,
  setTaskListAsCurrentList: TaskListActions.setTaskListAsCurrentList,
  fetchTasklistForUser: TaskListSagaActions.fetchTasklistForUser,
  acceptInviteToTaskList: InvitationActions.acceptInviteToTaskList,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
