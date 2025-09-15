import ProfilePatientList from './ProfilePatientList';
import { getPatientForProfile } from '@/app/api/profile-api';
import { useEffect, useState } from 'react';
import { currentProfileIdentifierSelector } from '@/app/selectors/profile-selector';
import { useSelector } from 'react-redux';
import { TableWrapper, ViewContainer } from './styled';

const ProfilePatientView = () => {
  const [patients, setPatients] = useState([]);
  const profileIdentifier = useSelector(currentProfileIdentifierSelector);

  useEffect(() => {
    getPatientForProfile(profileIdentifier).then((patients) => {
      setPatients(patients ?? []);
    });
  }, [profileIdentifier]);

  return (
    <ViewContainer>
      <TableWrapper>
        <ProfilePatientList patients={patients} />
      </TableWrapper>
    </ViewContainer>
  );
};

export default ProfilePatientView;
