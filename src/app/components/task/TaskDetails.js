import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  addTaskAttachment,
  removeTaskAttachment,
  updateTaskDescription,
  updateWorkflowStatus,
} from '../../actions/task-actions';
import useConfirmation from '../../hooks/useConfirmation';
import Attachments from '../attachments/Attachments';
import Comments from '../comments/Comments';
import Bookmark from '../common/Bookmark';
import DetailsDueDate from '../common/DetailsDueDate';
import EditableDescription from '../common/EditableDescription';
import History from '../common/History';
import ListPicker from '../common/ListPicker';
import Reminder from '../common/Reminder';
import StatusSelect from '../common/StatusSelect';
import MemberPicker from '../members/MemberPicker';
import PatientAssignment from '../patient/PatientAssignment';
import CompleteTaskConfirmationDialog from './CompleteTaskConfirmationDialog';
import AddSubtask from './AddSubtask';
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
  handleChange = event => {
    const { markComplete, selectedTask } = this.props;
    const status = event.target.checked ? 'INCOMPLETE' : 'COMPLETE';
    markComplete(selectedTask, status, 'INCOMPLETE');
  };

  handleBookmarkClick = () => {
    const { toggleTaskPriority, selectedTask } = this.props;
    toggleTaskPriority(selectedTask, selectedTask.priority);
  };

  handleStatusChange = e => {
    const status = e.target.value;
    const { selectedTask, updateWorkflowStatus: updateStatus } = this.props;
    updateStatus(selectedTask, status);
  };

  handleDescriptionChange = description => {
    const {
      selectedTask,
      updateTaskDescription: updateDescription,
    } = this.props;
    updateDescription(selectedTask, description);
  };

  handleAddAttachment = files => {
    if (files && files.length > 0) {
      const fileData = files[0];
      const { selectedTask } = this.props;
      // eslint-disable-next-line react/destructuring-assignment
      this.props.addTaskAttachment(selectedTask.taskIdentifier, fileData);
    }
  };

  handleRemoveAttachment = attachmentIdentifier => {
    if (attachmentIdentifier && attachmentIdentifier > 0) {
      const {
        removeTaskAttachment: removeAttachment,
        selectedTask,
      } = this.props;
      removeAttachment(selectedTask.taskIdentifier, attachmentIdentifier);
    }
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
              { value: 'NO_STATUS', description: 'No Status' },
              { value: 'IN_PROGRESS', description: 'In Progress' },
              { value: 'PLANNED', description: 'Planned' },
              { value: 'ON_HOLD', description: 'On Hold' },
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
      userIdentifier,
      addTaskComment,
      stickyStyle,
      confirmation,
      isMainTaskComplete,
    } = this.props;

    const { isOpen, close, handleStatusChange, confirm } = confirmation;

    if (selectedTask == null) {
      return null;
    }

    const { description, patient, subtasks, status, comments } = selectedTask;

    const isCompleted = status === 'COMPLETE';
    const isInbox = !selectedTask?.taskList?.taskListIdentifier;
    const isSubtask = selectedTask.parentTaskIdentifier !== null;

    return (
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
                {!isSubtask && (
                  <CompleteTaskConfirmationDialog
                    isOpen={isOpen}
                    close={close}
                    confirm={confirm}
                  />
                )}
                <StyledLabel
                  style={{ verticalAlign: 'top', lineHeight: '30px' }}
                >
                  <StyledCheckbox
                    checked={isCompleted}
                    onChange={handleStatusChange}
                    disabled={isSubtask && isMainTaskComplete}
                    style={{ marginRight: '-15px' }}
                  />
                </StyledLabel>
                <StyledDescription big lineThrough={isCompleted}>
                  <EditableDescription
                    placeholder="Enter task description"
                    value={description}
                    onChange={this.handleDescriptionChange}
                    disabled={isCompleted}
                    strikethrough={isCompleted}
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
                  {!isSubtask &&
                    (subtasks && subtasks.length === 0 ? (
                      <AddSubtask
                        taskIdentifier={selectedTask.taskIdentifier}
                        disabled={isCompleted}
                      />
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
                userIdentifier={userIdentifier}
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
                  <Reminder
                    completed={selectedTask.status === 'COMPLETE'}
                    task={selectedTask}
                  >
                    {selectedTask.reminderDt}
                  </Reminder>
                </StyledDescription>
              </tr>
              <tr>
                <StyledLabel
                  style={{ verticalAlign: 'top', lineHeight: '30px' }}
                >
                  <strong>Attachments</strong>
                </StyledLabel>
                <StyledDescription>
                  <Attachments
                    task={selectedTask.taskIdentifier}
                    attachments={selectedTask.attachments}
                    onAddAttachment={this.handleAddAttachment}
                    onRemoveAttachment={this.handleRemoveAttachment}
                    disabled={isCompleted}
                  />
                </StyledDescription>
              </tr>
              <tr>
                <StyledLabel
                  style={{ verticalAlign: 'top', lineHeight: '30px' }}
                >
                  <strong>History</strong>
                </StyledLabel>
                <StyledDescription>
                  <History taskIdentifier={selectedTask.taskIdentifier} />
                </StyledDescription>
              </tr>
            </table>
          </DetailsBox>
          <DetailsBox>
            <TaskActions task={selectedTask} />
          </DetailsBox>
        </StickyContainer>
      </DetailsContainer>
    );
  }
}

TaskDetails.propTypes = {
  markComplete: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  toggleTaskPriority: PropTypes.func.isRequired,
  selectedTask: PropTypes.shape({
    taskIdentifier: PropTypes.number,
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

const TaskDetailsWithConfirmation = props => {
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
