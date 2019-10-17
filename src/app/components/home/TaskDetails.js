import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  addTaskAttachment,
  removeTaskAttachment,
  updateTaskDescription,
  updateWorkflowStatus,
} from '../../actions/task-actions';
import { Confirmation, useConfirmation } from '../TaskCheckbox';
import AddSubtask from './AddSubtask';
import Attachments from './Attachments';
import Bookmark from './Bookmark';
import Comments from './comments/Comments';
import DetailsDueDate from './DetailsDueDate';
import EditableDescription from './EditableDescription';
import History from './History';
import ListPicker from './ListPicker';
import MemberPicker from './MemberPicker';
import PatientAssignment from './PatientAssignment';
import Reminder from './Reminder';
import StatusSelect from './StatusSelect';
import TaskActions from './TaskActions';
import {
  BookmarkContainer,
  DetailsBox,
  DetailsContainer,
  DetailsHeader,
  StatusContainer,
  StickyContainer,
  StyledCheckbox,
  StyledCloseButton,
  StyledDescription,
  StyledLabel,
} from './TaskDetails.styled';

class TaskDetails extends React.PureComponent {
  handleChange = (event) => {
    const { markComplete, selectedTask } = this.props;
    const status = event.target.checked ? 'INCOMPLETE' : 'COMPLETE';
    markComplete(selectedTask, status, 'INCOMPLETE');
  };

  handleBookmarkClick = () => {
    const { toggleTaskPriority, selectedTask } = this.props;
    toggleTaskPriority(selectedTask, selectedTask.priority);
  };

  handleStatusChange = (e) => {
    const status = e.target.value;
    const { selectedTask, updateWorkflowStatus: updateStatus } = this.props;
    updateStatus(selectedTask.taskId, status);
  };

  handleDescriptionChange = (description) => {
    const { selectedTask, updateTaskDescription: updateDescription } = this.props;
    updateDescription(selectedTask, description);
  };

  handleAddAttachment = (files) => {
    if (files && files.length > 0) {
      const fileData = files[0];
      const { selectedTask } = this.props;
      // eslint-disable-next-line react/destructuring-assignment
      this.props.addTaskAttachment(selectedTask.taskId, fileData);
    }
  };

  handleRemoveAttachment = (attachmentId) => {
    // const targetVal = e.target.value;
    if (attachmentId && attachmentId > 0) {
      const { selectedTask } = this.props;
      // eslint-disable-next-line react/destructuring-assignment
      this.props.removeTaskAttachment(selectedTask.taskId, attachmentId);
    }
  };

  onClickAway = () => {
    const { storeAsCurrentTask } = this.props;

    storeAsCurrentTask(null);
  };

  renderHeader() {
    const { close, selectedTask } = this.props;
    const isCompleted = selectedTask.status === 'COMPLETE';

    return (
      <DetailsHeader>
        <BookmarkContainer>
          <Bookmark
            isActive={selectedTask.priority === 'HIGH'}
            onClick={this.handleBookmarkClick}
            disabled={isCompleted}
          />
        </BookmarkContainer>
        <StatusContainer>
          {'Status '}
          <StatusSelect
            onChange={this.handleStatusChange}
            value={selectedTask.workflowStatus}
            disabled={isCompleted}
            options={[
              { value: 'IN_PROGRESS', description: 'In Progress' },
              { value: 'ON_HOLD', description: 'On Hold' },
              { value: 'BLOCKED', description: 'Planned' },
            ]}
          />
        </StatusContainer>
        <StyledCloseButton onClick={close}>✕</StyledCloseButton>
      </DetailsHeader>
    );
  }

  render() {
    const {
      selectedTask,
      userId,
      addTaskComment,
      stickyStyle,
      confirmation,
      isMainTaskComplete,
    } = this.props;

    const {
      isOpen, close, handleStatusChange, confirm,
    } = confirmation;

    if (selectedTask == null) {
      return null;
    }

    const {
      description, patient, subtasks, status, comments,
    } = selectedTask;

    const isCompleted = status === 'COMPLETE';
    const isInbox = !selectedTask?.taskList?.taskListId;
    const isSubtask = selectedTask.parentTaskId !== null;

    return (
      <ClickAwayListener onClickAway={this.onClickAway}>
        <DetailsContainer>
          <StickyContainer style={stickyStyle}>
            <DetailsBox>
              {this.renderHeader()}
              <table>
                <tr>
                  <StyledLabel>
                    <strong>Assigned to </strong>
                  </StyledLabel>
                  <StyledDescription>
                    <MemberPicker
                      task={selectedTask}
                      member={selectedTask.assignedTo}
                      disabled={isCompleted || isInbox}
                    />
                  </StyledDescription>
                </tr>
                <tr>
                  {!isSubtask && <Confirmation isOpen={isOpen} close={close} confirm={confirm} />}
                  <StyledLabel style={{ verticalAlign: 'top', lineHeight: '30px' }}>
                    <StyledCheckbox
                      checked={isCompleted}
                      onChange={handleStatusChange}
                      disabled={isSubtask && isMainTaskComplete}
                      style={{ marginRight: '-15px' }}
                    />
                  </StyledLabel>
                  <StyledDescription style={{ fontSize: '16px' }}>
                    <EditableDescription
                      placeholder="Enter task description"
                      value={description}
                      onChange={this.handleDescriptionChange}
                      disabled={isCompleted}
                    />
                  </StyledDescription>
                </tr>
                <tr>
                  <StyledLabel>Patient </StyledLabel>
                  <StyledDescription>
                    <PatientAssignment
                      patient={patient}
                      task={selectedTask}
                      isCompact
                      disabled={isCompleted}
                    />
                  </StyledDescription>
                </tr>
                <tr>
                  <StyledLabel />
                  <StyledDescription>
                    {!isSubtask
                      && (subtasks && subtasks.length === 0 ? (
                        <AddSubtask taskId={selectedTask.taskId} disabled={isCompleted} />
                      ) : (
                        <strong>{`Subtasks (${subtasks.length})`}</strong>
                      ))}
                  </StyledDescription>
                </tr>
              </table>
            </DetailsBox>
            <DetailsBox style={{ marginTop: 4 }}>
              <StyledLabel style={{ verticalAlign: 'top', lineHeight: '30px' }}>
                <strong>Comments </strong>
              </StyledLabel>
              <StyledDescription>
                <Comments
                  task={selectedTask}
                  comments={comments}
                  userId={userId}
                  submit={addTaskComment}
                  disabled={isCompleted}
                />
              </StyledDescription>
            </DetailsBox>
            <DetailsBox>
              <table>
                {selectedTask.taskList && (
                  <tr>
                    <StyledLabel>
                      <strong>Filed in</strong>
                    </StyledLabel>
                    <StyledDescription>
                      <ListPicker
                        item={selectedTask.taskList}
                        task={selectedTask}
                        disabled={isCompleted}
                      />
                    </StyledDescription>
                  </tr>
                )}
                <tr>
                  <StyledLabel>
                    <strong>Due date</strong>
                  </StyledLabel>
                  <StyledDescription>
                    <DetailsDueDate
                      completed={selectedTask.status === 'COMPLETE'}
                      task={selectedTask}
                    >
                      {selectedTask.dueDate}
                    </DetailsDueDate>
                  </StyledDescription>
                </tr>
                <tr>
                  <StyledLabel>
                    <strong>Reminder</strong>
                  </StyledLabel>
                  <StyledDescription>
                    <Reminder completed={selectedTask.status === 'COMPLETE'} task={selectedTask}>
                      {selectedTask.reminderDt}
                    </Reminder>
                  </StyledDescription>
                </tr>
                <tr>
                  <StyledLabel style={{ verticalAlign: 'top', lineHeight: '30px' }}>
                    <strong>Attachments</strong>
                  </StyledLabel>
                  <StyledDescription>
                    <Attachments
                      task={selectedTask.taskId}
                      attachments={selectedTask.attachments}
                      onAddAttachment={this.handleAddAttachment}
                      onRemoveAttachment={this.handleRemoveAttachment}
                      disabled={isCompleted}
                    />
                  </StyledDescription>
                </tr>
                <tr>
                  <StyledLabel style={{ verticalAlign: 'top', lineHeight: '30px' }}>
                    <strong>History</strong>
                  </StyledLabel>
                  <StyledDescription>
                    <History taskId={selectedTask.taskId} />
                  </StyledDescription>
                </tr>
              </table>
            </DetailsBox>
            <DetailsBox>
              <TaskActions task={selectedTask} />
            </DetailsBox>
          </StickyContainer>
        </DetailsContainer>
      </ClickAwayListener>
    );
  }
}

TaskDetails.propTypes = {
  markComplete: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  toggleTaskPriority: PropTypes.func.isRequired,
  selectedTask: PropTypes.shape({
    taskId: PropTypes.number,
    dueDate: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.oneOf(['INCOMPLETE', 'COMPLETE']),
    assignedTo: PropTypes.shape({
      profileThumbnailPictureHash: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      initials: PropTypes.string,
    }),
    assignedBy: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    patient: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mrn: PropTypes.string,
    }),
    comments: PropTypes.array,
    subtasks: PropTypes.array,
  }).isRequired,
};

const TaskDetailsWithConfirmation = (props) => {
  const { selectedTask, markComplete } = props;
  const confirmation = useConfirmation(selectedTask, markComplete);
  return <TaskDetails {...props} confirmation={confirmation} />;
};

export default connect(
  undefined,
  {
    updateWorkflowStatus,
    updateTaskDescription,
    addTaskAttachment,
    removeTaskAttachment,
  },
)(TaskDetailsWithConfirmation);
