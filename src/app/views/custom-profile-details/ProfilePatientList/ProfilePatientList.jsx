import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import React, { useEffect, useState } from 'react';
import { PatientCell } from './styled';
import { useHistory, useLocation } from 'react-router-dom';
import { getPatientForProfile } from '@/app/api/profile-api';
import { useSelector } from 'react-redux';
import { currentProfileIdentifierSelector } from '@/app/selectors/profile-selector';

const ProfilePatientList = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const profileIdentifier = useSelector(currentProfileIdentifierSelector);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatientForProfile(profileIdentifier).then((patients) => {
      setPatients(patients ?? []);
    });
  }, [profileIdentifier]);

  const mappedPatients = patients.map((patient) => ({
    ...patient,
    identifier: patient.patientId,
  }));

  return (
    <DataGrid
      fluid
      dataset={mappedPatients}
      hideFooterSelectedRowCount
      autoHeight
    >
      <Data
        name="Patients"
        value={(data) => (
          <PatientCell
            onClick={() => {
              const { patientIdentifier } = data;
              history.push({
                pathname: `/core/patient/${patientIdentifier}`,
                state: { from: pathname },
              });
            }}
          >
            {data.patientName}
          </PatientCell>
        )}
        flex={1}
      />

      <Data
        name="Relationship"
        value={(data) =>
          data.patientRelationFields?.map((field) => field.name).join(', ') ||
          'No relationship'
        }
        flex={1}
      />
    </DataGrid>
  );
};

export default ProfilePatientList;
