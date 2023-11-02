import React, { ForwardedRef, forwardRef, useCallback } from 'react'
import { Segment } from 'views/list-details/modules/Virtualized';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import * as Sc from './styled';
import messages from "components/tasklist/AddGroupNameButton/messages";
import AddGroupNameButton from "components/tasklist/AddGroupNameButton/AddGroupNameButton";
import GroupNameSection from "components/tasklist/GroupNameSection/GroupNameSection";
import { useDispatch, useSelector } from "react-redux";
import { userProfileSelector } from "../../../../../selectors/user-selectors";
import { TASK_LIST_RESTRICTIONS_OPTIONS, TASK_LIST_RESTRICTIONS_PROFILES } from "restrictions/task-restrictions";
import { currentTaskListSelector } from "../../../../../selectors/task-list-selectors";
import { isMemberAdmin } from "helpers/list-members-helper";
import * as ListDetailsActions from "actions/list-details-actions";

export interface Props extends Segment {}

function VAddGroup({ metadata, register }: Props, ref: ForwardedRef<HTMLDivElement>) {
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
  const onGroupNameClick = useCallback(
    (groupName: string) => createTaskGroupList(groupName),
    [createTaskGroupList],
  );

  return (
    <Sc.VAddGroup
      ref={ref}
      {...register}
    >
      <GroupNameSection
        initialValue={""}
        disabled={false}
        onEnterClick={
          restrictions?.createGroup !== DISABLED &&
          !restrictCustomizationFeatures
            ? onGroupNameClick
            : () => {}
        }
        placeholder={messages.placeholder}
        closeOnEnter
      >
        {restrictions?.createGroup !== DISABLED &&
          !restrictCustomizationFeatures && <AddGroupNameButton />}
      </GroupNameSection>
    </Sc.VAddGroup>
  );
}

export default forwardRef(VAddGroup);