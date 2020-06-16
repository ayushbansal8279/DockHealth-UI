import { connect } from 'react-redux';
import { InviteMemberPopoverWithButton } from 'components/members/InviteMemberPopover';
import {
  cancelInviteToTaskList,
  changeUserRoleForList,
  inviteUserToTaskList,
  removeUserFromTaskList,
} from 'actions/tasklist-actions';

const mapStateToProps = (_, ownProps) => {
  return {
    ...ownProps,
  };
};

const mapDispatchToProps = {
  cancelInviteToTaskList,
  removeUserFromTaskList,
  inviteUserToTaskList,
  changeUserRoleForList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InviteMemberPopoverWithButton);
