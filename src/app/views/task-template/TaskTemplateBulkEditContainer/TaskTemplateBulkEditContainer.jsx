import { connect } from 'react-redux';
import { allTasksSelector } from 'selectors/task-template-selectors';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';

function mapStateToProps(state) {
  return {
    allTasks: allTasksSelector(state),
  };
}

export default connect(mapStateToProps)(BulkEditSection);
