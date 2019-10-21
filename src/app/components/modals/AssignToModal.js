import React from 'react';

import MemberInitials from '../members/MemberInitials';

class AssignToModal extends React.Component {
  state = {
    members: [],
  };

  static getDerivedStateFromProps({ members }) {
    return {
      members,
    };
  }

  componentDidMount() {
    const { members } = this.props;

    this.setState({ members });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { task } = this.props;
    const { members } = this.state;

    return (
      !task ||
      (nextProps.task && task.taskId !== nextProps.task.taskId) ||
      (nextProps.task && task.assignedTo !== nextProps.task.assignedTo) ||
      (nextState.members && members.length !== nextState.members.length)
    );
  }

  handleMemberAssignment = ({ member }) => () => {
    const { assignOrReassignTask, task } = this.props;

    if (member) {
      assignOrReassignTask(task, member.userId, member);
    }
  };

  renderMember = ({ taskListId }) => member => {
    return (
      <div
        data-close=""
        onClick={this.handleMemberAssignment({ member })}
        key={`assign_${taskListId}_${member.userId}`}
        className="row condense expanded border-bottom align-middle"
      >
        <div className="columns shrink">
          <MemberInitials member={member} />
        </div>
        <div className="columns">
          <span className="item-content">{member.userName}</span>
          <span className="item-details">{member.taskListUserRole}</span>
          {member.status === 'PENDING' && (
            <span className="item-details highlight">Invited</span>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { assignOrReassignTask, members = [], task, taskListId } = this.props;

    return (
      <div
        className="reveal"
        id={`edit-assign-to-${task.taskId}`}
        data-reveal=""
      >
        <h5 className="margin-bottom text-center">Assign to</h5>
        <div className="scroll-wrapper">
          {members.map(this.renderMember({ taskListId }))}
          <button
            className="close-button"
            data-close=""
            aria-label="Close modal"
            type="button"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {task.assignedTo != null && (
          <div
            data-close=""
            onClick={() => assignOrReassignTask(task, -1, null)}
            className="small-link pointer"
          >
            Unassign task
          </div>
        )}
      </div>
    );
  }
}

export default AssignToModal;
