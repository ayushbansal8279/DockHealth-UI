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
      width: 200,
      editable: false,
      renderCell: (params) => {
        const row = params.row;
        if (!row) return null;

        const { fromEMR, patientIdentifier, firstName, lastName } = row;

        const displayName = `${lastName ?? ''}, ${firstName ?? ''}`.trim();

        const handleClick = async () => {
          if (fromEMR) {
            const patient = await lookupEMRPatient(patientIdentifier);

            history.push({
              pathname: `/core/patient/${patient.patientIdentifier}`,
              state: { from: pathname },
            });
          } else {
            history.push({
              pathname: `/core/patient/${patientIdentifier}`,
              state: { from: pathname },
            });
          }
          localStorage.setItem('navigation-from', pathname);
        };

        return (
          <PatientCell onClick={handleClick} className="patient-cell">
            <Tooltip placement="top" title={displayName}>
              <Text width="180">{displayName}</Text>
            </Tooltip>
          </PatientCell>
        );
      },
    },
    {
      field: 'relationship',
      headerName: 'RELATIONSHIP',
      renderHeader: renderColumnHeader,
      width: 150,
      editable: false,
      pinnable: true,
      renderCell: (params) => {
        const value = params.value ?? '';
        return (
          <Tooltip placement="top" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      field: 'mrn',
      headerName: uniqueIdentifierLabel.toUpperCase(),
      renderHeader: renderColumnHeader,
      width: 100,
      editable: false,
      renderCell: (params) => {
        const value = params.value ?? '';
        return (
          <Tooltip placement="top" title={value}>
            <Text width="80">{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      field: 'dob',
      headerName: 'DOB',
      renderHeader: renderColumnHeader,
      width: 150,
      editable: false,
      valueGetter: (value, row) => {
        if (!value) {
          return '';
        }
        return moment(value).format('MM/DD/YYYY');
      },
      sortComparator: (v1, v2) => {
        const date1 = new Date(v1);
        const date2 = new Date(v2);

        if (Number.isNaN(date1.getTime())) return 1;
        if (Number.isNaN(date2.getTime())) return -1;

        return date1 - date2;
      },
    },
    {
      field: 'age',
      headerName: 'AGE',
      renderHeader: renderColumnHeader,
      width: 70,
      editable: false,
      valueGetter: (_value, row) => {
        const dob = row?.dob;
        if (!dob) {
          return '';
        }
        return calculateAge(new Date(dob));
      },
      sortComparator: (_v1, _v2, params1, params2) => {
        const dob1 = params1.api.getCellValue(params1.id, 'dob');
        const dob2 = params2.api.getCellValue(params2.id, 'dob');

        if (!dob1) return 1;
        if (!dob2) return -1;

        const age1 = calculateAge(new Date(dob1));
        const age2 = calculateAge(new Date(dob2));

        return age1 - age2;
      },
    },
    {
      field: 'gender',
      headerName: 'SEX',
      renderHeader: renderColumnHeader,
      width: 100,
      editable: false,
      valueFormatter: (value) => {
        if (!value) return '';
        return genderBirthOptionHash[value] ?? value;
      },
    },
    {
      field: 'genderIdentity',
      headerName: 'GENDER',
      renderHeader: renderColumnHeader,
      width: 150,
      editable: false,
      valueFormatter: (value) => value || '',
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      renderHeader: renderColumnHeader,
      width: 140,
      editable: false,
      renderCell: (params) => {
        const value = params.value ?? '';
        return (
          <Tooltip placement="top" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      field: 'phoneMobile',
      headerName: 'MOBILE',
      renderHeader: renderColumnHeader,
      width: 140,
      editable: false,
      renderCell: (params) => {
        const value = params.value;
        const display = formatPhoneNumber(value);
        return (
          <Tooltip placement="top" title={display}>
            <Text>{display}</Text>
          </Tooltip>
        );
      },
    },
    {
      field: 'phoneHome',
      headerName: 'HOME',
      renderHeader: renderColumnHeader,
      width: 140,
      editable: false,
      renderCell: (params) => {
        const value = params.value;
        const display = formatPhoneNumber(value);
        return (
          <Tooltip placement="top" title={display}>
            <Text>{display}</Text>
          </Tooltip>
        );
      },
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
