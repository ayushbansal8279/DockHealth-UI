import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ButtonBase from '@material-ui/core/ButtonBase';

import Task from './Task';
import AddSubtask from './AddSubtask';

const StyledRow = styled(TableRow)`
  && {
    height: 36px;
    background: none;
  }
`;

const StyledCell = styled(TableCell)`
  && {
    border: none;
    padding: 3px 13px 13px 13px;

    :last-child {
      padding-right: 13px;
    }
  }
`;

const StyledTable = styled(Table)`
  && {
    border: none;
    border-collapse: collapse;
    padding: 0 8px;
  }
`;

const StyledContainer = styled.div`
  border: 3px solid #f5f8fa;
  border-radius: 1px;
  border-top: none;
`;

const StyledBar = styled(({ isCollapsed, ...rest }) => <ButtonBase {...rest} />)`
  && {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 36px;
    padding: 9px 15px 10px 26px;
    border-radius: 3px;
    ${({ isCollapsed }) => (isCollapsed
    ? `border: 3px solid transparent;
       background: #f5f8fa;`
    : `border: 3px solid #f5f8fa;
       border-bottom: none; 
       border-radius: 1px;`)}
  }
`;

StyledBar.defaultProps = {
  isCollapsed: false,
};

const StyledHeading = styled.div`
  font-size: 14px;
  color: #2e3a43;
`;

const StyledAction = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: #0ca1c7;
`;

const StyledFooter = styled.div`
  display: flex;
  margin-left: 24px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 550;
  color: #0ca1c7;
`;

const TableContainer = styled.div`
  padding: 0 12px 0 24px;
`;

class Subtasks extends React.Component {
  state = {
    isCollapsed: true,
  }

  toggleCollapsed = () => {
    const { isCollapsed } = this.state;
    this.setState({ isCollapsed: !isCollapsed });
  }

  captureClicks = (e) => {
    e.stopPropagation();
  }

  renderCollapsed = () => {
    const { subtasks } = this.props;

    return (
      <div>
        <StyledBar onClick={this.toggleCollapsed} isCollapsed>
          <StyledHeading>
            <strong>{`Subtasks (${subtasks.length})`}</strong>
          </StyledHeading>
          <StyledAction>
            <b>▢</b>
            {' Open'}
          </StyledAction>
        </StyledBar>
      </div>
    );
  }

  renderExpanded = () => {
    const {
      subtasks, markComplete, storeAsCurrentTask, hideDate, hideTags, selectedTaskId, parentTaskId, isCompleted,
    } = this.props;

    return (
      <div>
        <StyledBar onClick={this.toggleCollapsed}>
          <StyledHeading>
            <strong>{`Subtasks (${subtasks.length})`}</strong>
          </StyledHeading>
          <StyledAction>
            <b>✕</b>
            {' Close'}
          </StyledAction>
        </StyledBar>
        <StyledContainer>
          <TableContainer>
            <StyledTable padding="dense">
              {subtasks.map(subtask => (
                <Task
                  task={subtask}
                  markComplete={markComplete}
                  key={subtask.taskId}
                  isSubtask
                  storeAsCurrentTask={storeAsCurrentTask}
                  hideDate={hideDate}
                  hideTags={hideTags}
                  selectedTaskId={selectedTaskId}
                />
              ))}
            </StyledTable>
          </TableContainer>
          <StyledFooter>
            <AddSubtask taskId={parentTaskId} disabled={isCompleted} />
          </StyledFooter>
        </StyledContainer>
      </div>
    );
  }

  render() {
    const { isCollapsed } = this.state;

    return (
      <StyledRow onClick={this.captureClicks}>
        <StyledCell colSpan={9}>
          { isCollapsed ? this.renderCollapsed() : this.renderExpanded() }
        </StyledCell>
      </StyledRow>
    );
  }
}

Subtasks.propTypes = {
  parentTaskId: PropTypes.number.isRequired,
  subtasks: PropTypes.arrayOf(PropTypes.shape({
    taskId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dueDate: PropTypes.string,
    assignedTo: PropTypes.shape({
      userId: PropTypes.number,
      profileThumbnailPictureHash: PropTypes.string,
      initials: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
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
  })).isRequired,
};

export default Subtasks;
