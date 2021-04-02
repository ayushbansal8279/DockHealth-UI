import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'modal/actions';
import {
  taskTemplatesSelector,
  isFetchingTaskTemplatesSelector,
} from 'selectors/task-template-selectors';
import AddButton from 'components/common/AddButton/AddButton';
import Spacing from 'components/common/Spacing';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import { TaskTemplateViewContainer } from './styled';
import TaskTemplate from './TaskTemplate/TaskTemplate';
import TaskTemplatesLoader from './TaskTemplatesLoader/TaskTemplatesLoader';

const TaskTemplateView = ({
  isFetchingTaskTemplates,
  taskTemplates,
  modalActions,
}) => {
  return (
    <>
      <TaskTemplateViewContainer>
        <AddButton onClick={() => modalActions.openModal('CreateTemplate')}>
          Add Template
        </AddButton>
        <Spacing vertical={4} />
        {!isFetchingTaskTemplates ? (
          taskTemplates.map(template => (
            <TaskTemplate
              key={template.taskTemplateIdentifier}
              template={template}
            />
          ))
        ) : (
          <TaskTemplatesLoader />
        )}
        <TaskDrawer
          modalActions={modalActions}
          onTaskUpdate={() => {}}
          onTaskDelete={() => {}}
          onTaskCreation={() => {}}
        />
      </TaskTemplateViewContainer>
    </>
  );
};

function mapStateToProps(state) {
  return {
    isFetchingTaskTemplates: isFetchingTaskTemplatesSelector(state),
    taskTemplates: taskTemplatesSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modalActions: bindActionCreators(ModalActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskTemplateView);
