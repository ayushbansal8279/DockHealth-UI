import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as PatientsActions from 'actions/patients-actions';
import palette from 'styles/palette';
import { Box } from '@material-ui/core';
import AddButton from 'components/common/AddButton/AddButton';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { MoreVert } from '@material-ui/icons';
import {
  defaultPatientsListsSelector,
  customPatientsListsSelector,
  isFetchingPatientsListsSelector,
} from 'selectors/patients-selectors';
import { isEmpty } from 'ramda';
import { userProfileSelector } from 'selectors/user-selectors';
import { locationParametersSelector } from 'location/selectors';

import {
  DrawerMyListsLabel,
  DrawerListsItem,
  ListNameText,
  DrawerListsList,
  DrawerItemOptions,
  DrawerListsItemLoader,
} from './styled';

function getDefaultPatientsListUrlParameter(patientListIdentifier) {
  switch (patientListIdentifier) {
    case 'ACTIVE_PATIENTS':
      return 'active';

    case 'ALL_PATIENTS':
    default:
      return 'all';
  }
}

const PatientsSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const defaultPatientsLists = useSelector(defaultPatientsListsSelector);
  const customPatientsLists = useSelector(customPatientsListsSelector);
  const isFetching = useSelector(isFetchingPatientsListsSelector);
  const { orgUserRole } = useSelector(userProfileSelector);
  const { listIdentifier: listIdentifierUrlParameter } = useSelector(
    locationParametersSelector,
  );
  const isGuest = orgUserRole === 'GUEST';
  const isInitialListFetching = isFetching && isEmpty(defaultPatientsLists);

  useEffect(() => {
    PatientsActions.getPatientsLists()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCustomListClick = () => {
    dispatch(openModal('EditPatientList'));
    dispatch(hideSubMenu());
  };

  return (
    <>
      <DrawerMyListsLabel>
        <div>Patients </div>
      </DrawerMyListsLabel>
      <DrawerListsList flexShrink={0}>
        {!isInitialListFetching ? (
          <>
            {defaultPatientsLists?.map(
              ({ patientListIdentifier, listName, patientsCount }) => (
                <DrawerListsItem key={patientListIdentifier}>
                  <ListNameText
                    isActive={
                      getDefaultPatientsListUrlParameter(
                        patientListIdentifier,
                      ) === listIdentifierUrlParameter
                    }
                    onClick={() => {
                      history.push(
                        `/core/patients/list/${getDefaultPatientsListUrlParameter(
                          patientListIdentifier,
                        )}`,
                      );
                    }}
                  >
                    {listName}
                  </ListNameText>
                  <DrawerItemOptions>
                    <div>{patientsCount}</div>
                    <Box m={1.5} />
                  </DrawerItemOptions>
                </DrawerListsItem>
              ),
            )}
          </>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          new Array(2).fill().map((_, i) => <DrawerListsItemLoader key={i} />)
        )}
      </DrawerListsList>
      {!isGuest && (
        <>
          <Box m={6} flexShrink={0} />
          <DrawerMyListsLabel>
            <div>Custom Lists</div>
            <AddButton onClick={handleAddCustomListClick}>Add</AddButton>
          </DrawerMyListsLabel>
          <DrawerListsList>
            {!isInitialListFetching ? (
              <>
                {customPatientsLists?.map(patientsList => (
                  <DrawerListsItem key={patientsList.patientListIdentifier}>
                    <ListNameText
                      isActive={
                        patientsList.patientListIdentifier ===
                        listIdentifierUrlParameter
                      }
                      onClick={() => {
                        history.push(
                          `/core/patients/list/${patientsList.patientListIdentifier}`,
                        );
                      }}
                    >
                      {patientsList.listName}
                    </ListNameText>
                    <DrawerItemOptions>
                      <div>{patientsList.patientsCount}</div>
                      <OptionsMenu
                        disablePortal
                        options={[
                          {
                            name: 'Edit',
                            onClick: () => {
                              dispatch(
                                openModal('AddPatientToList', {
                                  patientsList,
                                }),
                              );
                              dispatch(hideSubMenu());
                            },
                          },
                          {
                            name: 'Delete',
                            onClick: () =>
                              PatientsActions.deletePatientsList(
                                patientsList.patientListIdentifier,
                              )(dispatch),
                            color: palette.oPlusRed,
                          },
                        ]}
                      >
                        <MoreVert style={{ color: palette.coolGrey1 }} />
                      </OptionsMenu>
                    </DrawerItemOptions>
                  </DrawerListsItem>
                ))}
              </>
            ) : (
              new Array(5)
                .fill()
                // eslint-disable-next-line react/no-array-index-key
                .map((_, i) => <DrawerListsItemLoader key={i} />)
            )}
          </DrawerListsList>
        </>
      )}
    </>
  );
};

export default PatientsSubmenu;
