/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'ramda';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { getPatients } from 'api/patient-api';
import { useDispatch } from 'react-redux';

import { PatientsViewContainer, PatientsListDescription } from './styled';

const parsePatientsListIdentifier = listIdentifier => {
  if (!listIdentifier)
    return {
      listIdentifier: 'ALL_PATIENTS',
      listType: 'DEFAULT',
    };

  if (listIdentifier === 'active')
    return {
      listIdentifier: 'ACTIVE_PATIENTS',
      listType: 'DEFAULT',
    };

  return {
    listIdentifier,
    listType: 'CUSTOM',
  };
};

const PatientsView = () => {
  const dispatch = useDispatch();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const { listIdentifier } = parsePatientsListIdentifier(
    listIdentifierParameter,
  );

  const [patientsList, setPatientsList] = useState({});

  useEffect(() => {
    getPatients(listIdentifier).then(data => setPatientsList(data));
  }, [listIdentifier]);

  useEffect(() => {
    if (!isEmpty(patientsList)) {
      dispatch(
        setHeader({
          layout: [
            {
              key: 'patients-view-header',
              component: (
                <>
                  <GenericHeader>
                    {patientsList?.listName}
                    <PatientsListDescription>
                      {patientsList?.listDescription}
                    </PatientsListDescription>
                  </GenericHeader>
                </>
              ),
            },
          ],
        }),
      );
    }
  }, [dispatch, listIdentifier, patientsList]);

  return <PatientsViewContainer />;
};

export default PatientsView;
