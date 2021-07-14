/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { object } from 'yup';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import { openModal, closeModal } from 'modal/actions';
import { useDispatch } from 'react-redux';
import PatientForm, {
  validationObjectShape,
} from 'components/patients/PatientForm/PatientForm';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
} from './styled';

const validationSchema = object().shape(validationObjectShape);

const PatientDetails = ({
  firstName,
  middleName,
  lastName,
  email,
  phoneMobile,
  phoneHome,
  dob,
  gender,
  mrn,
  isOpenedDetails,
  updatePatient,
  patientIdentifier,
  archivePatient,
  editingDisabled,
  currentUser,
  closeDetails,
}) => {
  const formattedDob = dob ? moment(dob).format('MM/DD/YYYY') : null;
  const defaultValues = {
    firstName,
    middleName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob: formattedDob,
    gender,
    mrn,
  };
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);
  const [contextMenuIsOpened, setContextMenuIsOpened] = useState(false);
  const contextMenuReference = useRef();
  const formMethods = useForm({
    defaultValues,
    reValidateMode: 'onSubmit',
    validationSchema,
  });
  const handleEdit = () => {
    setIsActive(true);
  };
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { handleSubmit, clearError, reset } = formMethods;
  const formReference = useRef(null);

  const close = () => {
    setIsActive(false);
    closeDetails();
    clearError(Object.keys(defaultValues));
  };

  const handleClose = () => {
    if (isActive) {
      dispatch(
        openModal('InterruptEdit', {
          isWorkflowModal: true,
          confirm: () => {
            formReference.current.dispatchEvent(new Event('submit'));
            dispatch(closeModal());
          },
          onClose: close,
        }),
      );
    } else {
      close();
    }
  };

  const handlePatientArchive = () => {
    archivePatient();
  };

  useEffect(() => {
    if (!isOpenedDetails) {
      setIsActive(false);
    } else {
      reset({ ...defaultValues });
      clearError(Object.keys(defaultValues));
    }
  }, [isOpenedDetails]);

  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);
  const CONTEXT_MENU_OPTIONS = [
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEdit,
    },
    {
      key: 'archivePatient',
      label: 'Archive',
      onClick: handlePatientArchive,
    },
  ];
  const handleFormSubmit = handleSubmit(data => {
    setIsActive(false);
    updatePatient({ ...data, patientIdentifier });
  });
  return (
    <DrawerWrapper open={isOpenedDetails} anchor="right" onClose={handleClose}>
      <ContentWrapper>
        <StickyHeader>
          <TitleName>{`${defaultValues.lastName}, ${defaultValues.firstName} ${
            defaultValues.middleName ? defaultValues.middleName : ''
          }`}</TitleName>
          <MoreActinsWrapper>
            <button
              type="button"
              ref={contextMenuReference}
              onClick={() => setContextMenuIsOpened(true)}
            >
              {!editingDisabled && <MoreVertIcon />}
            </button>
            <button type="button" onClick={handleClose}>
              <CloseIcon />
            </button>
          </MoreActinsWrapper>
        </StickyHeader>
        <PatientForm
          formMethods={formMethods}
          onSubmit={handleFormSubmit}
          uniqueIdentifierLabel={uniqueIdentifierLabel}
          editingDisabled={editingDisabled}
          readOnly={!isActive}
          customerTypeLabel={customerTypeLabel}
          buttonLabel="SAVE EDITS"
          ref={formReference}
        />
      </ContentWrapper>
      <MenuPopover
        anchorEl={contextMenuReference?.current}
        open={contextMenuIsOpened}
        onClose={() => setContextMenuIsOpened(false)}
        onAfterOptionClick={() => setContextMenuIsOpened(false)}
        itemType="secondary"
        options={CONTEXT_MENU_OPTIONS}
      />
    </DrawerWrapper>
  );
};
export default PatientDetails;
