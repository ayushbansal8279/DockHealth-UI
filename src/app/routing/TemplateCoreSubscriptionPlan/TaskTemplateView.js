import React from 'react';
import { setHeader } from 'actions/template-actions';
import * as TaskTemplateActions from 'actions/task-template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';

export const onEnterTemplatesView = ({ dispatch }) => {
  dispatch(
    setHeader({
      layout: [
        {
          key: 'templates-view-header',
          component: <GenericHeader>Workflows Library</GenericHeader>,
        },
      ],
    }),
  );
  dispatch(TaskTemplateActions.getTemplates());
};

export const onLeaveTemplatesView = () => {};
