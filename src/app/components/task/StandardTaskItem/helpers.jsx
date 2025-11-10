import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  SubtaskStylingLastLink,
  SubtaskStylingLinkContainer,
  SubtaskStylingVerticalPart,
  SubtaskStylingHorizontalPart,
} from '../styled';
import palette from '@/app/styles/palette';

export const getMatchedComments = (comments, matchingCommentIdentifiers) =>
  matchingCommentIdentifiers?.length > 0
    ? comments.filter(({ commentIdentifier }) =>
        matchingCommentIdentifiers.includes(commentIdentifier),
      )
    : comments;

export const originConfig = {
  PATIENT: {
    hasCustomOffset: true,
    disableLeftOffset: true,
    enableTaskGroup: false,
    quickAddWidthOffset: 20,
    disableRightOffset: true,
    showListPickerModal: true,
    dragAndDropDisabled: true,
  },
  LIST: {
    hasCustomOffset: false,
    disableLeftOffset: false,
    enableTaskGroup: true,
    quickAddWidthOffset: 87,
    disableRightOffset: false,
    showListPickerModal: false,
    dragAndDropDisabled: false,
  },
};

export const getSubtaskStylingLink = (isLast, origin) => {
  if (isLast)
    return (
      <SubtaskStylingLastLink
        hasCustomOffset={originConfig[origin]?.hasCustomOffset ?? false}
      />
    );

  return (
    <SubtaskStylingLinkContainer
      hasCustomOffset={originConfig[origin]?.hasCustomOffset ?? false}
    >
      <SubtaskStylingVerticalPart />
      <SubtaskStylingHorizontalPart />
    </SubtaskStylingLinkContainer>
  );
};

const getPatientName = (patient) => {
  if (!patient) return '';
  return patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}.`
    : `${patient?.lastName}, ${patient?.firstName}`;
};

const getPatientFieldTooltipContent = (patient, pathname, search) => {
  if (!patient?.patientIdentifier) {
    return 'This is a patient field and can only be edited on the patient page';
  }
  const patientName = getPatientName(patient);
  return (
    <>
      This is a patient field and can only be edited on the{' '}
      <Link
        to={{
          pathname: `/core/patient/${patient.patientIdentifier}`,
          state: {
            from: search ? pathname + search : pathname,
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          sessionStorage.setItem(
            'navigation-from',
            search ? pathname + search : pathname,
          );
        }}
        style={{
          color: palette.brightBlue,
          textDecoration: 'underline',
          fontWeight: 'bold',
        }}
      >
        {patientName}
      </Link>{' '}
      patient page
    </>
  );
};

export const PatientFieldTooltip = ({ patient, children }) => {
  const { pathname, search } = useLocation();

  return (
    <Tooltip
      placement="top"
      title={getPatientFieldTooltipContent(patient, pathname, search)}
    >
      {children}
    </Tooltip>
  );
};
