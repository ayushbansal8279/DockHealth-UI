import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  allPatientsStatsSelector,
  activePatientsStatsSelector,
} from 'selectors/patients-selectors';
import * as PatientsActions from 'actions/patients-actions';

import {
  DrawerMyListsLabel,
  DrawerListsItem,
  ListNameText,
  DrawerListsList,
  PatientsCount,
} from './styled';

const PatientsSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const allPatientsStats = useSelector(allPatientsStatsSelector);
  const activePatientsStats = useSelector(activePatientsStatsSelector);

  useEffect(() => {
    PatientsActions.getDefaultPatientsLists()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DrawerMyListsLabel>
        <div>Patients </div>
      </DrawerMyListsLabel>
      <DrawerListsList>
        <DrawerListsItem>
          <ListNameText
            onClick={() => {
              history.push(`/core/patients`);
            }}
          >
            All Patients
          </ListNameText>
          <PatientsCount>{allPatientsStats?.patientsCount}</PatientsCount>
        </DrawerListsItem>
        <DrawerListsItem>
          <ListNameText
            onClick={() => {
              history.push(`/core/patients/active`);
            }}
          >
            Active Tasks
          </ListNameText>
          <PatientsCount>{activePatientsStats?.patientsCount}</PatientsCount>
        </DrawerListsItem>
      </DrawerListsList>
    </>
  );
};

export default PatientsSubmenu;
