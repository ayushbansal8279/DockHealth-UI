/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useForm, FormContext } from 'react-hook-form';
// import { Collapse } from '@material-ui/core';
import { getCustomerUniqueIDLabel } from 'helpers/customer-type-helper';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { mixed, object, string } from 'yup';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import Button from 'components/common/Button/Button';
import { openModal, closeModal } from 'modal/actions';
import Spacing from 'components/common/Spacing';
import { useDispatch } from 'react-redux';
import {
  PatientDetailsForm,
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
  PatietnDetailsFormFooter,
  SubmitButtonWrapper,
} from './styled';

const DATE_FORMAT = 'MM/DD/YYYY';
const REQUIRED_MESSAGE = 'This field is required';

const validationObjectShape = {
  firstName: string().required(REQUIRED_MESSAGE),
  middleName: string().nullable(),
  lastName: string().required(REQUIRED_MESSAGE),
  mrn: string(),
  gender: string().nullable(),
  dob: mixed()
    .nullable()
    .transform(newValue => {
      const dobMoment = moment(newValue, DATE_FORMAT);

      if (!newValue) {
        return null;
      }

      if (
        newValue?.replace(/[/_-]/g, '')?.length <
        DATE_FORMAT.replace(/\//g, '').length
      ) {
        return new Error();
      }

      if (dobMoment.isValid()) {
        return newValue;
      }

      return new Error();
    })
    .test(
      'validDate',
      `This field requires date in ${DATE_FORMAT} format`,
      function validDate(value) {
        if (value instanceof Error) {
          this.createError();
          return false;
        }

        return true;
      },
    ),
  email: string()
    .nullable()
    .transform(value => (!value ? null : value))
    .email('This field requires a valid email address'),
  phoneHome: string().nullable(),
  phoneMobile: string().nullable(),
};

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
  const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
  const [isOpenedContact, setIsOpenedContact] = useState(true);
  const contextMenuReference = useRef();
  const formMethods = useForm({
    defaultValues,
    reValidateMode: 'onSubmit',
    validationSchema,
  });
  const handleEdit = () => {
    setIsOpenedPersonal(true);
    setIsOpenedContact(true);
    setIsActive(true);
  };

  const { handleSubmit, clearError, getValues, reset } = formMethods;

  const { gender: genderValue } = getValues();

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
            updatePatient({ ...getValues(), patientIdentifier });
            dispatch(closeModal());
            close();
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
  const GENDER_OPTIONS = [
    {
      value: 'female',
      label: 'Female',
    },
    {
      value: 'male',
      label: 'Male',
    },
    {
      value: 'other',
      label: 'Other',
    },
  ];
  const CONTEXT_MENU_OPTIONS = [
    {
      key: 'edit',
      label: 'Edit',
      onClick: handleEdit,
    },
    {
      key: 'archivePatient',
      label: 'Archive patient',
      onClick: handlePatientArchive,
    },
  ];
  return (
    <DrawerWrapper open={isOpenedDetails} anchor="right" onClose={handleClose}>
      <ContentWrapper>
        <StickyHeader>
          <TitleName>{`${defaultValues.firstName} ${
            defaultValues.middleName ? defaultValues.middleName : ''
          } ${defaultValues.lastName}`}</TitleName>
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
        <FormContext {...formMethods}>
          <PatientDetailsForm
            onSubmit={handleSubmit(data => {
              setIsActive(false);
              updatePatient({ ...data, patientIdentifier });
            })}
          >
            <LabeledCollapse
              name="Patient personal info"
              isOpened={isOpenedPersonal}
              onClick={() => setIsOpenedPersonal(!isOpenedPersonal)}
            >
              <FormInput
                label="first name"
                readOnly={!isActive}
                name="firstName"
                isRequired
              />
              <Spacing vertical={1} />
              <FormInput
                label="middle name"
                readOnly={!isActive}
                name="middleName"
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormInput
                label="last name"
                readOnly={!isActive}
                name="lastName"
                isRequired
              />
              <Spacing vertical={1} />
              <FormSelect
                label="gender"
                readOnly={!isActive}
                options={GENDER_OPTIONS}
                name="gender"
                defaultValue={genderValue}
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormInput
                label="birthday"
                readOnly={!isActive}
                placeholder="MM/DD/YYYY"
                inputComponent={DateInput}
                name="dob"
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormInput
                label={uniqueIdentifierLabel}
                readOnly={!isActive}
                placeholder="- -"
                name="mrn"
                isRequired={false}
              />
              <Spacing vertical={1} />
            </LabeledCollapse>
            <LabeledCollapse
              name="Patient contact info"
              isOpened={isOpenedContact}
              onClick={() => setIsOpenedContact(!isOpenedContact)}
            >
              <FormPhoneNumberInput
                label="mobile phone"
                readOnly={!isActive}
                name="phoneMobile"
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormPhoneNumberInput
                label="home phone"
                readOnly={!isActive}
                name="phoneHome"
                type="tel"
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormInput
                label="email"
                readOnly={!isActive}
                name="email"
                isRequired={false}
              />
              <Spacing vertical={1} />
            </LabeledCollapse>
            {!editingDisabled && (
              <PatietnDetailsFormFooter>
                {isActive && (
                  <SubmitButtonWrapper>
                    <Button width="153px" type="submit">
                      SAVE EDITS
                    </Button>
                  </SubmitButtonWrapper>
                )}
              </PatietnDetailsFormFooter>
            )}
          </PatientDetailsForm>
        </FormContext>
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
