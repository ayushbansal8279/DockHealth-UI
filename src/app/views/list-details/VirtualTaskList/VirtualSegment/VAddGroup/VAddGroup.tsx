import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
} from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import messages from 'components/tasklist/AddGroupNameButton/messages';
import AddGroupNameButton from 'components/tasklist/AddGroupNameButton/AddGroupNameButton';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import { useDispatch, useSelector } from 'react-redux';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import MoreVert from '@mui/icons-material/MoreVert';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { isMemberAdmin } from 'helpers/list-members-helper';
import * as ListDetailsActions from 'actions/list-details-actions';
import { userProfileSelector } from '../../../../../selectors/user-selectors';
import { currentTaskListSelector } from '../../../../../selectors/task-list-selectors';
import * as Sc from './styled';
import { ListPageContext } from 'views/list-details/ListDetailsView';
import {
  GroupOpenContainer,
  GroupOptionsContainer,
} from 'components/tasklist/TasksGroup/styled';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';

export interface Props extends Segment {}

function VAddGroup(
  { metadata, register }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations
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
    }
  };

  const onGroupNameClick = useCallback(
    (groupName: string) => {
      createTaskGroupList(groupName);
      scrollToNewGroup();
    },
    [createTaskGroupList],
  );
  const { addNewGroup, handleAddNewGroup } = useContext(ListPageContext);

  return (
    <>
      <Sc.VAddGroup active={addNewGroup} ref={ref} {...register}>
        {addNewGroup && (
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
        )}
      </Sc.VAddGroup>
      {addNewGroup && (
        <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={100}>
          <QuickAddTaskInput />
        </StickyContainer>
      )}
    </>
  );
}

export default forwardRef(VAddGroup);
