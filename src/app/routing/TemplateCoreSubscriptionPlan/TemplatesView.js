import React from 'react';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';

export const onEnterTemplatesView = ({ dispatch }) => {
  dispatch(
    setHeader({
      layout: [
        {
          key: 'templates-view-header',
          component: <GenericHeader>Templates</GenericHeader>,
        },
      ],
    }),
  );
};

export const onLeaveTemplatesView = () => {};
