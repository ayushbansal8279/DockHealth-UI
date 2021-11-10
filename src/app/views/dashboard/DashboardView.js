import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { isEmpty } from 'ramda';
import * as TemplateActions from 'actions/template-actions';
import {
  clearDashboardState,
  initializeDashboardState,
} from 'actions/dashboard-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { clearFiltersForMegaFilter } from 'actions/mega-filter-actions';
import * as TaskListActions from 'actions/task-list-actions';
import * as UserAuthApi from 'api/user-auth-api';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import Spacing from 'components/common/Spacing';
import { openModal } from 'modal/actions';
import { onNewUserTourEnter } from 'helpers/ga-event-helper';
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
import {
  DashboardViewWrapper,
  DashboardContentWrapper,
  DashboardHeaderContainer,
  DashboardFirstVisitViewWrapper,
  DashboardScrollableList,
  DashboardListWrapper,
  StyledConfetti,
} from './styled';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import newUserTourHooks from './new-user-tour-hooks';

const DashboardView = ({ tabName }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const [
    firstCreatedUserListIdentifier,
    setFirstCreatedUserListIdentifier,
  ] = useState(null);
  const [openConfetti, setOpenConfetti] = useState(false);

  const currentUserLoaded = currentUser && !isEmpty(currentUser);
  const { usageState } = currentUser ?? {};
  const { hasExistingLists, hasOnlyInvitedLists } = usageState ?? {};

  const createListViewVisible = !hasExistingLists || hasOnlyInvitedLists;

  useEffect(() => {
    dispatch(initializeDashboardState(tabName));

    return () => {
      dispatch(clearFiltersForMegaFilter());
    };
  }, [dispatch, tabName]);

  useEffect(() => {
    dispatch(TemplateActions.hideHeader());

    return () => {
      dispatch(TemplateActions.showHeader());
      dispatch(clearDashboardState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(TaskListActions.getTaskListForUser());
    dispatch(TaskListActions.getPendingTaskListsForUser());
  }, [dispatch]);

  const isNewUser = currentUser?.usageState?.loginCount <= 5;

  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      UserAuthApi.refreshAccessToken(user.username);
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

  const handleCreateFirstList = () => {
    let firstListIdentifier;
    onNewUserTourEnter('Opened create list modal');
    dispatch(
      openModal('ListForm', {
        onListCreationSuccess: taskListIdentifier => {
          onNewUserTourEnter('Create list success');
          firstListIdentifier = taskListIdentifier;
        },
        onClose: () => {
          if (firstListIdentifier) {
            dispatch(TaskListActions.getTaskListForUser());
            UserAuthApi.getUserByEmail(currentUser.email, currentUser);
            setFirstCreatedUserListIdentifier(firstListIdentifier);
            setOpenConfetti(true);
          }
        },
      }),
    );
  };

  const {
    tourModalIsOpen,
    forceOpenTourModal,
    renderNewUserTour,
  } = newUserTourHooks({
    firstCreatedUserListIdentifier,
    setFirstCreatedUserListIdentifier,
    isNewUser,
  });

  return (
    <ColumnsConfigProvider>
      <DashboardViewWrapper>
        {currentUserLoaded && (
          <DashboardContentWrapper>
            {openConfetti && <StyledConfetti recycle={false} />}
            <DashboardScrollableList>
              <div>
                <DashboardHeaderContainer>
                  <DashboardHeader
                    isUserFirstTime={
                      createListViewVisible || firstCreatedUserListIdentifier
                    }
                    currentUser={currentUser}
                  />
                </DashboardHeaderContainer>
                <Spacing vertical={3} />
              </div>
              {createListViewVisible ? (
                <DashboardFirstVisitViewWrapper>
                  <DashboardFirstVisitView
                    hasInvitedLists={hasOnlyInvitedLists}
                    onCreateList={handleCreateFirstList}
                    onTakeATour={() => {
                      onNewUserTourEnter('Video tutorial');
                      dispatch(
                        openModal('Video', {
                          title: 'Emailing a Task to Dock Health',
                          url: 'https://www.youtube.com/embed/FlScR9Rjq1E',
                        }),
                      );
                    }}
                    acceptInvitation={() =>
                      dispatch(TaskListActions.acceptInviteToTaskList())
                    }
                  />
                </DashboardFirstVisitViewWrapper>
              ) : (
                <DashboardListWrapper fullWidth={createListViewVisible}>
                  <DashboardList
                    currentUser={currentUser}
                    tourModalIsOpen={tourModalIsOpen}
                    openTourModal={forceOpenTourModal}
                    customerTypeLabel={customerTypeLabel}
                  />
                </DashboardListWrapper>
              )}
            </DashboardScrollableList>
          </DashboardContentWrapper>
        )}
        {renderNewUserTour()}
      </DashboardViewWrapper>
    </ColumnsConfigProvider>
  );
};

export default DashboardView;
