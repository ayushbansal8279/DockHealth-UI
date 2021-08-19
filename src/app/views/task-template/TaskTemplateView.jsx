import React, { useCallback, useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
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
import {
  BULK_EDIT_COMPLETE_OPTION,
  BULK_EDIT_DUE_DATE_OPTION,
  BULK_EDIT_MOVE_OPTION,
} from 'components/tasklist/BulkEditSection/helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import { TaskTemplateViewContainer } from './styled';
import TaskTemplate from './TaskTemplate/TaskTemplate';
import TaskTemplatesLoader from './TaskTemplatesLoader/TaskTemplatesLoader';
import TaskTemplateBanner from './TaskTemplateBanner/TaskTemplateBanner';
import TaskTemplateBulkEditContainer from './TaskTemplateBulkEditContainer/TaskTemplateBulkEditContainer';

const BULK_EDIT_OPTIONS_CONFIG = {
  [BULK_EDIT_MOVE_OPTION]: false,
  [BULK_EDIT_COMPLETE_OPTION]: false,
  [BULK_EDIT_DUE_DATE_OPTION]: false,
};

const TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY =
  'TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY';

const TaskTemplateView = ({
  isFetchingTaskTemplates,
  taskTemplates,
  modalActions,
  taskTemplateActions,
  userProfile,
}) => {
  const history = useHistory();
  const [viewType, setViewType] = useState(ViewType.SLIM_VIEW);
  const [isBannerOpen, setIsBannerOpen] = useState(
    !localStorageHelper.getItem(TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY),
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
    <TaskTemplateBulkEditContainer
      optionsConfig={BULK_EDIT_OPTIONS_CONFIG}
      refreshTasks={taskTemplateActions.reloadOpenedTemplateTasks}
    >
      <TaskTemplateViewContainer>
        {isBannerOpen && (
          <>
            <TaskTemplateBanner
              firstTemplate={taskTemplates?.length <= 2}
              onCreateTemplate={handleCreateTemplate}
              onClose={() => {
                setIsBannerOpen(false);
                localStorageHelper.setItem(
                  TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY,
                  true,
                );
              }}
            />
            <Spacing vertical={4} />
          </>
        )}
        <Grid container justify="flex-end" alignItems="center">
          <AddButton onClick={handleCreateTemplate}>Add Workflow</AddButton>
          <ViewTypeSwitch value={viewType} onChange={setViewType} />
        </Grid>
        <Spacing vertical={4} />
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
        <TaskDrawer />
      </TaskTemplateViewContainer>
    </TaskTemplateBulkEditContainer>
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
