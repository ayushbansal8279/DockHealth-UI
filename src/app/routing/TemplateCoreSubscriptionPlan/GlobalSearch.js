import React from 'react';
import { resetGlobalSearch } from 'actions/global-search-actions';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';

export const onEnterGlobalSearch = ({ dispatch }) => {
  dispatch(
    setHeader({
      layout: [
        {
          key: 'global-search-header',
          component: <GenericHeader>Search</GenericHeader>,
        },
      ],
    }),
  );
};

export const onLeaveGlobalSearch = ({ dispatch }) => {
  dispatch(resetGlobalSearch());
};
