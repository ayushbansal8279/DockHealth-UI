import React from 'react';
import { resetGlobalSearch } from 'actions/global-search-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import { setHeader } from 'actions/header-actions';
import GenericHeader from 'components/common/GenericHeader';

export const onEnterGlobalSearch = ({ dispatch }) => {
  setHeader(dispatch)({
    layout: [
      {
        key: 'global-search-header',
        component: <GenericHeader>Search</GenericHeader>,
      },
    ],
  });
};

export const onLeaveGlobalSearch = ({ dispatch }) => {
  dispatch(resetGlobalSearch());
  dispatch(closeDrawer());
};
