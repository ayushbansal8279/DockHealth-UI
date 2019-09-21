import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';
import ButtonBase from '@material-ui/core/ButtonBase';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress';
import OverflowTooltips from '../OverflowTooltips';
import { getTaskHistory, clearCurrentTaskHistory } from '../../actions/task-actions';

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 350px;
  padding-top: 150px;
  padding-right: 80px;
`;

const AuditContainer = styled.div`
  padding-right: 23px;
  height: 350px;
  overflow: auto;
`;

const AuditEntry = styled.div`
  height: 26px;
  font-size: 14px;
  color: #585858;
  display: flex;
  flex-direction: row;
`;

const AuditPerson = styled.div`
  width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-shrink: 0;
`;

const AuditDescription = styled.div`
  margin: 0 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const AuditDate = styled.div`
  margin-left: auto;
  white-space: pre;
`;

const Audit = ({
  auditId, auditEventTypeDescription, createdDateTime, user,
}) => (
  <AuditEntry key={auditId}>
    <AuditPerson>{user.userName}</AuditPerson>
    <AuditDescription>{auditEventTypeDescription}</AuditDescription>
    <AuditDate>{createdDateTime}</AuditDate>
  </AuditEntry>
);

const HistoryToggle = styled(ButtonBase)`
  && {
    font-size: 14px;
    color: #13a7d1;
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
  }
`;

export const generateFormat = (date) => {
  const currentDate = moment();
  const isToday = d => d.isSame(currentDate, 'day');
  const isCurrentYear = d => d.isSame(currentDate, 'year');

  const yearFormat = isCurrentYear(date) ? '' : '\'YY';
  const monthDayFormat = isToday(date) ? '' : 'MMM D';
  const timeFormat = (date.hour() % 13) < 10 ? ' h:mma' : 'h:mma';

  return `${yearFormat} ${monthDayFormat} ${timeFormat}`;
};

const formatDate = date => date.format(generateFormat(date));

export class History extends React.Component {
  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { clearHistory } = this.props;
    clearHistory();
  }

  componentDidUpdate(prevProps) {
    const { taskId } = this.props;
    if (prevProps.taskId !== taskId) {
      this.setState({ isOpen: false }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  toggleHistory = () => {
    const { isOpen } = this.state;
    const { taskId, fetchHistory, clearHistory } = this.props;

    if (isOpen) {
      clearHistory();
    } else {
      fetchHistory(taskId);
    }

    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { history, isLoading, error } = this.props;
    const { isOpen } = this.state;

    const parsedHistory = history && history.map(audit => ({
      ...audit,
      createdDateTime: formatDate(moment(audit.createdDateTime)),
    }));

    return (
      <div>
        <HistoryToggle onClick={this.toggleHistory}>{isOpen && !error ? 'Hide' : 'Show'}</HistoryToggle>
        {isLoading && (
        <FadeContainer>
          <Fade in={isLoading} unmountOnExit style={{ transitionDelay: isLoading ? '800ms' : '0ms' }}>
            <ProgressIcon />
          </Fade>
        </FadeContainer>
        )}
        {isOpen && !error && parsedHistory && (
          <OverflowTooltips>
            <AuditContainer>
              {parsedHistory.map(audit => (
                <Audit {...audit} key={audit.auditId} />
              ))}
            </AuditContainer>
          </OverflowTooltips>
        )}
      </div>
    );
  }
}

History.propTypes = {
  taskId: PropTypes.number.isRequired,
  fetchHistory: PropTypes.func.isRequired,
  clearHistory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    auditId: PropTypes.number,
    auditEventTypeDescription: PropTypes.string,
    createdDateTime: PropTypes.string,
    user: PropTypes.shape({
      userId: PropTypes.number,
      userName: PropTypes.string,
    }),
  })),
};

History.defaultProps = {
  history: null,
};

const mapStateToProps = store => ({
  history: store.taskState.currentTaskHistory,
  isLoading: store.taskState.isHistoryFetching,
  error: store.taskState.historyError,
});

const mapDispatchToProps = {
  fetchHistory: taskId => getTaskHistory({ taskId }),
  clearHistory: clearCurrentTaskHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
