import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import ButtonBase from '@material-ui/core/ButtonBase';

import MemberPicker from './MemberPicker';
import Bookmark from './Bookmark';
import Patient from './Patient';
import StatusSelect from './StatusSelect';
import ListPicker from './ListPicker';
import Comments from './comments/Comments';
import History from './History';
import TaskActions from './TaskActions';
import DetailsDueDate from './DetailsDueDate';
import Reminder from './Reminder';

const StyledCheckbox = styled(props => <Checkbox {...props} classes={{ checked: 'checked' }} />)`
  && {
    width: 36px;
    height: 36px;
  }
  &&.checked {
    color: #00a73c;
  }
`;

const StyledLabel = styled.td`
  border-top: 12px solid transparent;
  white-space: nowrap;
  min-width: 80px;
  font-size: 12px;
  font-weight: bold;
  text-align: right;
  vertical-align: middle;
`;

const StyledDescription = styled.td`
  border-top: 12px solid transparent;
  width: 100%;
  padding-left: 16px;
  font-size: 14px;
`;


const DetailsHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledCloseButton = styled(ButtonBase)`
  && {
    margin-left: auto;
    width: 36px;
    height: 36px;
    background: #d9036b;
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
  }
`;

const BookmarkContainer = styled.div`
  width: 80px;
  display: flex;
  justify-content: center;
  margin-top: -13px;
`;

const StatusContainer = styled.div`
  margin-left: 20px;
`;

const DetailsContainer = styled.div`
  flex: 1;
  padding-right: 8px;
  padding-bottom: 4px;
`;

const DetailsBox = styled.div`
  padding: 13px;
  margin-bottom: 4px;
  background: #fff;
  border: 2px solid #ddf2f7;
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 100;
`;

class TaskDetails extends React.PureComponent {
  handleChange = (event) => {
    const { markComplete, selectedTask } = this.props;
    const status = event.target.checked ? 'INCOMPLETE' : 'COMPLETE';
    markComplete(selectedTask, status, 'INCOMPLETE');
  }

  handleBookmarkClick = () => {
    const { toggleTaskPriority, selectedTask } = this.props;
    toggleTaskPriority(selectedTask, selectedTask.priority);
  }

  handleStatusChange = (e) => {
    console.log('NYI', e);
    // TODO: Call redux action
  }

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
            disabled={isCompleted}
            value="HIGH"
            options={[
              { value: 'HIGH', description: 'Blocked' },
              { value: 'MEDIUM', description: 'On Hold' }]}
          />
        </StatusContainer>
        <StyledCloseButton onClick={close}>
          {'✕'}
        </StyledCloseButton>
      </DetailsHeader>
    );
  }

  render() {
    const { selectedTask, userId, addTaskComment } = this.props;
    if (selectedTask == null) { return null; }

    const {
      description, patient, subtasks, status, comments,
    } = selectedTask;

    const isCompleted = status === 'COMPLETE';

    return (
      <DetailsContainer>
        <StickyContainer>
          <DetailsBox>
            {this.renderHeader()}
            <table>
              <tr>
                <StyledLabel><strong>Assigned to </strong></StyledLabel>
                <StyledDescription>
                  <MemberPicker
                    task={selectedTask}
                    member={selectedTask.assignedTo}
                    disabled={isCompleted}
                  />
                </StyledDescription>
              </tr>
              <tr>
                <StyledLabel>
                  <StyledCheckbox
                    checked={isCompleted}
                    onChange={this.handleChange}
                    disabled={isCompleted}
                  />
                </StyledLabel>
                <StyledDescription>{description}</StyledDescription>
              </tr>
              <tr>
                <StyledLabel>Patient </StyledLabel>
                <StyledDescription>
                  {patient ? <Patient patient={patient} isCompact /> : 'None'}
                </StyledDescription>
              </tr>
              {(subtasks && subtasks.length !== 0) && (
                <tr>
                  <StyledLabel>
                    <strong>{`Subtasks (${subtasks.length})`}</strong>
                  </StyledLabel>
                </tr>
              )}
            </table>
          </DetailsBox>
          <DetailsBox style={{ marginTop: 4 }}>
            <StyledLabel style={{ verticalAlign: 'top', lineHeight: '30px' }}>
              <strong>Comments </strong>
            </StyledLabel>
            <StyledDescription>
              <Comments
                comments={comments}
                userId={userId}
                submit={addTaskComment}
                disabled={isCompleted}
              />
            </StyledDescription>
          </DetailsBox>
          <DetailsBox>
            <table>
              <tr>
                <StyledLabel><strong>Filed in</strong></StyledLabel>
                <StyledDescription>
                  <ListPicker
                    item={selectedTask.taskList}
                    task={selectedTask}
                    disabled={isCompleted}
                  />
                </StyledDescription>
              </tr>
              <tr>
                <StyledLabel><strong>Due date</strong></StyledLabel>
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
                <StyledLabel><strong>Reminder</strong></StyledLabel>
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
            <TaskActions taskId={selectedTask.taskId} />
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
    taskId: PropTypes.number,
    dueDate: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
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

export default TaskDetails;
