import React, { useCallback } from 'react';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { updatePartialWorkflow } from 'actions/task-template-actions';

import {
  StandardTaskItemCell,
  MemberGroupContainer,
  AssignMemberIconContainer,
  PublicInfoWrapper,
} from './styled';

const TaskTemplatePermissions = ({ template }) => {
  const { members: transformedMembers, identifier, publicAccess } = template;
  const dispatch = useDispatch();
  const members = transformedMembers.map(({ user, memberPermission }) => ({
    ...user,
    memberPermission,
  }));
  const openListEditModal = useCallback(() => {
    dispatch(
      openModal('ListPermissions', {
        list: {
          taskTemplateIdentifier: identifier,
          members,
          template,
        },
        onMembersRefresh: refreshedMembers => {
          // dispatch(
          //   updatePartialWorkflow(identifier, {
          //     members: refreshedMembers,
          //   }),
          // );
        },
      }),
    );
  }, [dispatch, members, identifier, template]);
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

export default TaskTemplatePermissions;
