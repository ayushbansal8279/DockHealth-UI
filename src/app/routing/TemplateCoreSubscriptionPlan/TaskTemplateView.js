import * as TaskTemplateActions from 'actions/task-template-actions';

export const onEnterTemplatesView = ({ dispatch }) => {
  dispatch(TaskTemplateActions.getTemplates());
};

export const onLeaveTemplatesView = () => {};
