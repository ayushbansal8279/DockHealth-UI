import React, { useCallback, useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as ModalActions from 'modal/actions';
import * as TaskTemplateActions from 'actions/task-template-actions';
import {
  taskTemplatesSelector,
  isFetchingTaskTemplatesSelector,
} from 'selectors/task-template-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import AddButton from 'components/common/AddButton/AddButton';
import Spacing from 'components/common/Spacing';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import {
  BULK_EDIT_COMPLETE_OPTION,
  BULK_EDIT_DUE_DATE_OPTION,
  BULK_EDIT_MOVE_OPTION,
} from 'components/tasklist/BulkEditSection/helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import { TaskTemplateViewContainer } from './styled';
import TaskTemplate from './TaskTemplate/TaskTemplate';
import TaskTemplatesLoader from './TaskTemplatesLoader/TaskTemplatesLoader';
import TaskTemplateBaner from './TaskTemplateBaner/TaskTemplateBaner';

const BULK_EDIT_OPTIONS_CONFIG = {
  [BULK_EDIT_MOVE_OPTION]: false,
  [BULK_EDIT_COMPLETE_OPTION]: false,
  [BULK_EDIT_DUE_DATE_OPTION]: false,
};

const TASK_TEMPLATES_BANER_CLOSED_STORAGE_KEY =
  'TASK_TEMPLATES_BANER_CLOSED_STORAGE_KEY';

const TaskTemplateView = ({
  isFetchingTaskTemplates,
  taskTemplates,
  modalActions,
  taskTemplateActions,
  userProfile,
}) => {
  const history = useHistory();
  const [viewType, setViewType] = useState(ViewType.SLIM_VIEW);
  const [isBanerOpen, setIsBanerOpen] = useState(
    !localStorageHelper.getItem(TASK_TEMPLATES_BANER_CLOSED_STORAGE_KEY),
  );

  useEffect(() => {
    if (userProfile?.orgUserRole === 'GUEST') {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleCreateTemplate = useCallback(() => {
    modalActions.openModal('CreateTemplate');
  }, [modalActions]);

  return (
    <BulkEditSection
      optionsConfig={BULK_EDIT_OPTIONS_CONFIG}
      refreshTasks={taskTemplateActions.reloadOpenedTemplateTasks}
    >
      <TaskTemplateViewContainer>
        {isBanerOpen && (
          <>
            <TaskTemplateBaner
              firstTemplate={taskTemplates?.length <= 1}
              onCreateTemplate={handleCreateTemplate}
              onClose={() => {
                setIsBanerOpen(false);
                localStorageHelper.setItem(
                  TASK_TEMPLATES_BANER_CLOSED_STORAGE_KEY,
                  true,
                );
              }}
            />
            <Spacing vertical={4} />
          </>
        )}
        <AddButton onClick={handleCreateTemplate}>Add Template</AddButton>
        <Spacing vertical={4} />
        {!!taskTemplates?.length && (
          <>
            <ViewTypeSwitch value={viewType} onChange={setViewType} />
            <Spacing vertical={4} />
          </>
        )}
        {!isFetchingTaskTemplates ? (
          taskTemplates.map(template => (
            <TaskTemplate
              key={template.taskTemplateIdentifier}
              template={template}
              isFullView={viewType === ViewType.FULL_VIEW}
            />
          ))
        ) : (
          <TaskTemplatesLoader />
        )}
        <TaskDrawer modalActions={modalActions} />
      </TaskTemplateViewContainer>
    </BulkEditSection>
  );
};

function mapStateToProps(state) {
  return {
    isFetchingTaskTemplates: isFetchingTaskTemplatesSelector(state),
    taskTemplates: taskTemplatesSelector(state),
    userProfile: userProfileSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modalActions: bindActionCreators(ModalActions, dispatch),
    taskTemplateActions: bindActionCreators(TaskTemplateActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskTemplateView);
