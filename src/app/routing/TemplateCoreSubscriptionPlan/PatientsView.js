import React from 'react';
import { setHeader } from 'actions/header-actions';
import GenericHeader from 'components/common/GenericHeader';

export const onEnterPatientsView = ({ dispatch }) => {
  setHeader(dispatch)({
    layout: [
      {
        key: 'patients-view-header',
        component: <GenericHeader>Patients</GenericHeader>,
      },
    ],
  });
};

export const onLeavePatientsView = () => {};
