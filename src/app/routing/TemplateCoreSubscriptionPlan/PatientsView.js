import React from 'react';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/common/GenericHeader';

export const onEnterPatientsView = ({ dispatch }) => {
  dispatch(
    setHeader({
      layout: [
        {
          key: 'patients-view-header',
          component: <GenericHeader>Patients</GenericHeader>,
        },
      ],
    }),
  );
};

export const onLeavePatientsView = () => {};
