import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { assignOrReassignTask } from '../../actions/task-actions';
import MemberSlot from './MemberSlot';
import MemberPicker from './MemberPicker';

const MemberAssignment = ({
  member, members, update, small, task,
}) => (
  <MemberPicker assign={update} member={member} members={members} task={task}>
    {({ open }) => (
      <MemberSlot onClick={open} member={member} small={small} />
    )}
  </MemberPicker>
);

const memberShape = PropTypes.shape({
  memberId: PropTypes.number,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
});

MemberAssignment.propTypes = {
  member: memberShape,
  members: PropTypes.arrayOf(memberShape),
  update: PropTypes.func.isRequired,
  task: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
};

MemberAssignment.defaultProps = {
  member: null,
  members: null,
};

const mapStateToProps = store => ({
  members: store.taskListState.tasklistmembers,
});

const mapDispatchToProps = (dispatch, { task }) => ({
  update: (memberId) => { assignOrReassignTask(task, memberId)(dispatch); },
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberAssignment);
