import React, { useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as PatientsActions from 'actions/patients-actions';
import palette from 'styles/palette';
import { Box } from '@mui/material';
import {
  DefaultPatientListUrl,
  getPatientListIdentifierByUrlParameter,
} from 'helpers/patient-list-helpers';
import AddButton from 'components/common/AddButton/AddButton';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { MoreVert } from '@mui/icons-material';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  defaultPatientsListsSelector,
  customPatientsListsSelector,
  isFetchingPatientsListsSelector,
} from 'selectors/patients-selectors';
import { selectDynamicPatientListFilter } from 'actions/patients-actions';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import compose from 'ramda/src/compose';
import toLower from 'ramda/src/toLower';
import {
  userProfileSelector,
  userHasPatientCustomListsFeatureSelector,
} from 'selectors/user-selectors';
import { locationParametersSelector } from 'location/selectors';
import { isUserGuestOrDockLite, isUserViewOnly } from 'helpers/user-helper';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import {
  getQuickFilters,
  quickContextTypes,
} from 'actions/mega-filter-actions';
import { quickFiltersSelector } from 'selectors/mega-filter-selectors';
import PatientListsIcon from 'img/premium/patient-lists.svg';
import pluralize from 'pluralize';
import {
  DrawerMyListsLabel,
  DrawerListsItem,
  ListNameText,
  DrawerListsList,
  DrawerItemOptions,
  DrawerListsItemLoader,
  UpgradePlanContainer,
} from './styled';

const PatientsSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const defaultPatientsLists = useSelector(defaultPatientsListsSelector);
  const customPatientsLists = useSelector(customPatientsListsSelector);
  const isFetching = useSelector(isFetchingPatientsListsSelector);
  const { listIdentifier: listIdentifierUrlParameter } = useSelector(
    locationParametersSelector,
  );
  const currentUser = useSelector(userProfileSelector);
  const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const isInitialListFetching = isFetching && !defaultPatientsLists;

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customListsAvailable = useSelector(
    userHasPatientCustomListsFeatureSelector,
  );

  const { organizationIdentifier } = useSelector(organizationSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);

  useEffect(() => {
    dispatch(PatientsActions.getPatientsLists());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(
      getQuickFilters({
        organizationIdentifier,
        contextType: quickContextTypes.PATIENTS,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCustomListClick = () => {
    dispatch(openModal('EditPatientList'));
    dispatch(hideSubMenu());
  };

  const openDeleteConfirmationModal = useCallback(
    (list) => {
      const modalProps = {
        title: 'Delete list',
        description:
          'Are you sure you want to delete this list? This action cannot be undone.',
        confirm: () => {
          if (list?.patientListIdentifier === listIdentifierUrlParameter) {
            history.push(`/`);
          }
          dispatch(
            PatientsActions.deletePatientsList(list.patientListIdentifier),
          );
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
      dispatch(hideSubMenu());
    },
    [dispatch, history, listIdentifierUrlParameter],
  );

  const sortedCustomPatientsLists = useMemo(
    () =>
      customPatientsLists
        ? sortBy(compose(toLower, prop('listName')), customPatientsLists)
        : null,
    [customPatientsLists],
  );

  return (
    <>
      <DrawerMyListsLabel>
        <div>{`${capitalize(pluralize(customerTypeLabel))}`} </div>
      </DrawerMyListsLabel>
      <DrawerListsList flexShrink={0}>
        {isInitialListFetching ? (
          Array.from({ length: 2 })
            .fill()
            // eslint-disable-next-line react/no-array-index-key
            .map((_, index) => <DrawerListsItemLoader key={index} />)
        ) : (
          <>
            {defaultPatientsLists?.map(
              ({ patientListIdentifier, listName, patientsCount }) => (
                <DrawerListsItem key={patientListIdentifier}>
                  <ListNameText
                    isActive={
                      patientListIdentifier ===
                      getPatientListIdentifierByUrlParameter(
                        listIdentifierUrlParameter,
                      )
                    }
                    onClick={() => {
                      history.push(
                        `/core/patients/list/${DefaultPatientListUrl[patientListIdentifier]}`,
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
        )}
      </DrawerListsList>
      {!isGuestOrDockLite && customListsAvailable && (
        <>
          <Box m={1} flexShrink={0} />
          <DrawerMyListsLabel>
            <div>Custom Lists</div>
            {!isViewOnly && (
              <AddButton onClick={handleAddCustomListClick}>Add</AddButton>
            )}
          </DrawerMyListsLabel>
          <DrawerListsList>
            {isInitialListFetching ? (
              Array.from({ length: 5 })
                .fill()
                // eslint-disable-next-line react/no-array-index-key
                .map((_, index) => <DrawerListsItemLoader key={index} />)
            ) : (
              <>
                {sortedCustomPatientsLists?.map((patientsList) => (
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
                        disablePortal={false}
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
                              openDeleteConfirmationModal(patientsList),
                            color: palette.oPlusRed,
                          },
                        ]}
                      >
                        <MoreVert color="primary" />
                      </OptionsMenu>
                    </DrawerItemOptions>
                  </DrawerListsItem>
                ))}
              </>
            )}
          </DrawerListsList>
        </>
      )}
      {!isGuestOrDockLite && customListsAvailable && (
        <>
          <Box m={1} flexShrink={0} />
          <DrawerMyListsLabel>
            <div>Dynamic Lists</div>
          </DrawerMyListsLabel>
          <DrawerListsList>
            {isInitialListFetching ? (
              Array.from({ length: 5 })
                .fill()
                // eslint-disable-next-line react/no-array-index-key
                .map((_, index) => <DrawerListsItemLoader key={index} />)
            ) : (
              <>
                {quickFiltersList?.map((quickFilter) => (
                  <DrawerListsItem key={quickFilter.quickFilterIdentifier}>
                    <ListNameText
                      isActive={
                        quickFilter.quickFilterIdentifier ===
                        listIdentifierUrlParameter
                      }
                      onClick={() => {
                        dispatch(
                          selectDynamicPatientListFilter(
                            quickFilter.quickFilterIdentifier,
                          ),
                        );
                        dispatch(
                          PatientsActions.setDynamicPatientsSelectedFilters(
                            quickFilter.selectedOptions,
                          ),
                        );
                        history.push(`/core/patients/list/dynamic`);
                      }}
                    >
                      {quickFilter.name}
                    </ListNameText>
                  </DrawerListsItem>
                ))}
              </>
            )}
          </DrawerListsList>
        </>
      )}
      {!customListsAvailable && (
        <UpgradePlanContainer>
          <UpgradePlan
            title="Custom patients list"
            description="Group and organize your patients with custom lists from Dock Premium."
            iconImage={<img src={PatientListsIcon} alt="Custom User Groups" />}
          />
        </UpgradePlanContainer>
      )}
    </>
  );
};

export default PatientsSubmenu;
