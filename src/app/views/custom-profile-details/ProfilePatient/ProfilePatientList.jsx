import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { lookupEMRPatient } from '@/app/api/patient-api';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from '@/app/helpers/customer-type-helper';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from '@/app/selectors/user-selectors';
import { useSelector } from 'react-redux';
import { formatPhoneNumber } from '@/app/helpers/utility-functions';
import { GENDER_OPTIONS_BIRTH } from '@/app/types/gender';
import { getValueLabelHashFromOptions } from '@/app/helpers/select-option-helper';
import ReusableDataGrid from 'components/common/ReusableDataGrid';
import { Text, PatientCell } from './styled';

const renderColumnHeader = (props) => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <Tooltip placement="top" title={headerName}>
          <Text width={colDef.width - 35}>{headerName}</Text>
        </Tooltip>
      </div>
    </>
  );
};

const ProfilePatientList = ({ patients = [] }) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(
    currentUser,
    currentOrganization,
  );
  const genderBirthOptionHash =
    getValueLabelHashFromOptions(GENDER_OPTIONS_BIRTH);

  function calculateAge(dob) {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const formattedPatients = useMemo(
    () =>
      patients?.map((patient) => {
        const metaData = patient.patientMetaData?.map((pmd) => {
          return {
            key: pmd.customFieldIdentifier,
            value:
              pmd.displayName ||
              pmd.value ||
              pmd.displayNames?.sort().toString(),
          };
        });

        const patientDetails = {
          id: patient?.patientIdentifier || patient?.id || patient?.mrn,
          ...patient,
        };
        
        if (Array.isArray(patient.patientRelationFields)) {
          patientDetails.relationship =
            patient.patientRelationFields[0]?.name || '';
        }

        metaData?.forEach((element) => {
          patientDetails[element.key] = element.value;
        });
        return patientDetails;
      }),
    [patients],
  );

  const defaultColumns = [
    {
      field: 'patient',
      headerName: customerTypeLabel.toUpperCase(),
      renderHeader: renderColumnHeader,
      renderCell: ({ row }) => (
        <PatientCell
          onClick={async () => {
            const { fromEMR, patientIdentifier } = row;
            if (fromEMR) {
              const patient = await lookupEMRPatient(patientIdentifier);

              history.push({
                pathname: `/core/patient/${patient.patientIdentifier}`,
                state: {
                  from: pathname,
                },
              });
              localStorage.setItem('navigation-from', pathname);
            } else {
              history.push({
                pathname: `/core/patient/${patientIdentifier}`,
                state: {
                  from: pathname,
                },
              });
              localStorage.setItem('navigation-from', pathname);
            }
          }}
          className="patient-cell"
        >
          <Tooltip placement="top" title={`${row.lastName}, ${row.firstName}`}>
            <Text width="180">
              {row.lastName}, {row.firstName}
            </Text>
          </Tooltip>
        </PatientCell>
      ),
      width: 200,
      editable: false,
    },
    {
      field: 'relationship',
      headerName: 'RELATIONSHIP',
      renderHeader: renderColumnHeader,
      width: 150,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.relationship}>
          <Text>{row.relationship}</Text>
        </Tooltip>
      ),
      editable: false,
      pinnable: true,
    },
    {
      field: 'mrn',
      headerName: uniqueIdentifierLabel.toUpperCase(),
      renderHeader: renderColumnHeader,
      width: 100,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.mrn}>
          <Text width="80">{row.mrn}</Text>
        </Tooltip>
      ),
      editable: false,
    },
    {
      field: 'dob',
      headerName: 'DOB',
      renderHeader: renderColumnHeader,
      width: 150,
      valueGetter: ({ value }) =>
        value ? moment(value).format('MM/DD/YYYY') : '',
      sortComparator: (v1, v2) => {
        const date1 = new Date(v1);
        const date2 = new Date(v2);

        if (!date1 || isNaN(date1)) return 1;
        if (!date2 || isNaN(date2)) return -1;

        return date1 - date2;
      },
      editable: false,
    },
    {
      field: 'age',
      headerName: 'AGE',
      renderHeader: renderColumnHeader,
      width: 70,
      valueGetter: ({ row }) => {
        if (!row.dob) return '';
        return calculateAge(new Date(row.dob));
      },
      sortComparator: (_v1, _v2, parameters1, parameters2) => {
        const dob1 = parameters1.api.getCellValue(parameters1.id, 'dob');
        const dob2 = parameters2.api.getCellValue(parameters2.id, 'dob');

        if (!dob1) return 1;
        if (!dob2) return -1;

        const age1 = calculateAge(new Date(dob1));
        const age2 = calculateAge(new Date(dob2));

        return age1 - age2;
      },
      editable: false,
    },
    {
      field: 'gender',
      headerName: 'SEX',
      renderHeader: renderColumnHeader,
      width: 100,
      valueFormatter: ({ value }) => genderBirthOptionHash[value],
      editable: false,
    },
    {
      field: 'genderIdentity',
      headerName: 'GENDER',
      renderHeader: renderColumnHeader,
      width: 150,
      valueFormatter: ({ value }) => value || '',
      editable: false,
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      renderHeader: renderColumnHeader,
      width: 140,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.email}>
          <Text>{row.email}</Text>
        </Tooltip>
      ),
      editable: false,
    },
    {
      field: 'phoneMobile',
      headerName: 'MOBILE',
      renderHeader: renderColumnHeader,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={formatPhoneNumber(row.phoneMobile)}>
          <Text>{formatPhoneNumber(row.phoneMobile)}</Text>
        </Tooltip>
      ),
      width: 140,
      editable: false,
    },
    {
      field: 'phoneHome',
      headerName: 'HOME',
      renderHeader: renderColumnHeader,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={formatPhoneNumber(row.phoneHome)}>
          <Text>{formatPhoneNumber(row.phoneHome)}</Text>
        </Tooltip>
      ),
      width: 140,
      editable: false,
    },
  ];

  return (
    <ReusableDataGrid
      columns={defaultColumns}
      rows={formattedPatients}
      getRowId={(row) => row.patientIdentifier}
      pinnedColumns={{
        left: ['patient', 'relationship'],
      }}
      hideFooterSelectedRowCount
      placeholder="Filter Results"
      showExport={false}
    />
  );
};

export default ProfilePatientList;
