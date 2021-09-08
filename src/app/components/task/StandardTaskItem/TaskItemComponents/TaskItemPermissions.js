import React, { useCallback } from 'react';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { updateTemplate } from 'actions/task-template-actions';

import {
  StandardTaskItemCell,
  MemberGroupContainer,
  AssignMemberIconContainer,
  PublicInfoWrapper,
} from '../../styled';

const TaskItemPermissions = ({ template }) => {
  const { members, taskTemplateIdentifier, publicAccess } = template;
  const dispatch = useDispatch();
  const openListEditModal = useCallback(() => {
    dispatch(
      openModal('ListPermissions', {
        list: { taskTemplateIdentifier, members, template },
        onMembersRefresh: refreshedMembers => {
          dispatch(
            updateTemplate(taskTemplateIdentifier, {
              members: refreshedMembers,
            }),
          );
        },
      }),
    );
  }, [dispatch, members, taskTemplateIdentifier, template]);
  const { userIdentifier } = useSelector(userProfileSelector);
  const currentUser = members.find(
    user => user.userIdentifier === userIdentifier,
  );

  const hasAccessToEdit =
    currentUser && currentUser.memberPermission === 'EDITOR';

  return (
    <StandardTaskItemCell
      width={200}
      justify="flex-end"
      paddingLeft="small"
      paddingRight="small"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      {!!members?.length && (
        <MemberGroupContainer>
          <MemberGroup members={members} />
        </MemberGroupContainer>
      )}
      {hasAccessToEdit && (
        <Tooltip placement="top" title="Grant permissions">
          <AssignMemberIconContainer onClick={openListEditModal}>
            <AssignMemberIcon />
          </AssignMemberIconContainer>
        </Tooltip>
      )}
      {publicAccess && <PublicInfoWrapper>Public</PublicInfoWrapper>}
    </StandardTaskItemCell>
  );
};

export default TaskItemPermissions;
