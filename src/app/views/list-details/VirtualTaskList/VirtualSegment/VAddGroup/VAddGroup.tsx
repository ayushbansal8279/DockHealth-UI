import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
} from 'react';
import { Box } from '@mui/material';
import { Segment } from 'views/list-details/modules/Virtualized';
import messages from 'components/tasklist/AddGroupNameButton/messages';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import { useDispatch, useSelector } from 'react-redux';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import MoreVert from '@mui/icons-material/MoreVert';
import { isMemberAdmin } from 'helpers/list-members-helper';
import * as ListDetailsActions from 'actions/list-details-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import * as Sc from './styled';
import { ListPageContext } from 'views/list-details/ListDetailsView';
import {
  GroupOpenContainer,
  GroupOptionsContainer,
} from 'components/tasklist/TasksGroup/styled';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { useVirtualTaskListScrollContext } from '../../VirtualTaskListScrollContext';

export interface Props extends Segment {}

function VAddGroup(
  { metadata, register }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;
  const taskList = useSelector(currentTaskListSelector);
  const { restrictCustomization } = taskList || {};
  const currentUserMember = taskList?.listUsers.find(
    (u: any) => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const restrictCustomizationFeatures = restrictCustomization && !isListAdmin;
  const { addNewGroup, handleAddNewGroup } = useContext(ListPageContext);
  const { visibleWidth, droppableHeaderWidth } =
    useVirtualTaskListScrollContext();

  const createTaskGroupList = useCallback(
    (groupName: string) => {
      dispatch(ListDetailsActions?.createTaskListGroup(groupName));
    },
    [dispatch],
  );

  const scrollToNewGroup = () => {
    const scrollbar = document.querySelector(
      '[data-test-id="virtuoso-scroller"]',
    );

    if (scrollbar) {
      scrollbar.scrollTo(0, scrollbar.scrollHeight);
      setTimeout(() => {
        const updatedScrollbar = document.querySelector(
          '[data-test-id="virtuoso-scroller"]',
        );
        updatedScrollbar?.scrollTo(0, updatedScrollbar.scrollHeight);
      }, 1000);
    }
  };

  const onGroupNameClick = useCallback(
    (groupName: string) => {
      createTaskGroupList(groupName);
      scrollToNewGroup();
    },
    [createTaskGroupList],
  );

  if (!addNewGroup) {
    return null;
  }

  return (
    <Box
      sx={{
        width: droppableHeaderWidth ? `${droppableHeaderWidth + 50}px` : '100%',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          left: 0,
          width: visibleWidth ? `${visibleWidth - 10}px` : '100%',
        }}
      >
        <Sc.VAddGroup active={addNewGroup} ref={ref} {...register}>
          <>
            <GroupOpenContainer>
              <RotatableChevron alt="arrow" color="#8492A4" />
            </GroupOpenContainer>
            <Spacing horizontal={1} />
            <GroupNameSection
              initialValue={''}
              disabled={addNewGroup}
              onEnterClick={
                restrictions?.createGroup !== DISABLED &&
                !restrictCustomizationFeatures
                  ? onGroupNameClick
                  : () => {}
              }
              placeholder={messages.placeholder}
              handleInput={handleAddNewGroup}
              closeOnEnter
            >
              {restrictions?.createGroup !== DISABLED &&
                !restrictCustomizationFeatures && <></>}
            </GroupNameSection>

            <GroupOptionsContainer>
              <MoreVert color="primary" />
            </GroupOptionsContainer>
          </>
        </Sc.VAddGroup>
        <Box
          sx={{
            marginLeft: '56px',
            paddingBottom: '50px',
            marginTop: '-5px',
          }}
        >
          <QuickAddTaskInput />
        </Box>
      </Box>
    </Box>
  );
}

export default forwardRef(VAddGroup);
