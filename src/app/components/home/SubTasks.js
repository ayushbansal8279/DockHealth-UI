import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ButtonBase from '@material-ui/core/ButtonBase';

import Task from './Task';

const StyledRow = styled(TableRow)`
  && {
    height: 36px;
    background: none;
  }
`;

const StyledCell = styled(TableCell)`
  && {
    border: none;
    padding: 0 13px 13px 13px;

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

    tbody {
      background-color: #f5f8fa;
    }
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
  margin-bottom: 21px;
  margin-top: 19px;
  margin-left: 24px;
  font-size: 12px;
  font-weight: 550;
  color: #0ca1c7;
`;

const AddCircle = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #0ca1c7;
  border-radius: 50%;

  ::before {
    content: '+';
    color: #fff;
    display: block;
    text-align: center;
    font-size: 13px;
    font-weight: normal;
  }
`;

const StyledAddLabel = styled.div`
  padding-top: 2px;
  margin-left: 5px;
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
    const { subtasks, markComplete } = this.props;

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
                <Task task={subtask} markComplete={markComplete} key={subtask.taskId} isSubtask />
              ))}
            </StyledTable>
          </TableContainer>
          <StyledFooter>
            <AddCircle />
            <StyledAddLabel>Add a subtask</StyledAddLabel>
          </StyledFooter>
        </StyledContainer>
      </div>
    );
  }

  render() {
    const { isCollapsed } = this.state;

    return (
      <StyledRow>
        <StyledCell colSpan={9}>
          { isCollapsed ? this.renderCollapsed() : this.renderExpanded() }
        </StyledCell>
      </StyledRow>
    );
  }
}

Subtasks.propTypes = {
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
