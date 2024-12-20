import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';
import { checkIfUserIsOrganizationAdmin } from '@/app/helpers/user-helper';
import {
  MeterBillingViewOuterContainer,
  MeterBillingViewContainer,
  MeterBillingSecondHeader,
} from './styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import MeteringTable from './MeteringTable/MeteringTable';
import MeteringFilter from './MeteringFilter/MeteringFilter';
import MeteringSearch from './MeteringSearch/MeteringSearch';
import { getMeteringEvents } from '@/app/api/metering-api';

const MeterBillingView = () => {
  const history = useHistory();

  const currentUser = useSelector(userProfileSelector);

  const getMeteringData = async () => {
    const payload = {
      start: '2024-12-01T09:08:04.996Z',
      end: '2024-12-20T09:08:04.996Z',
      limit: 10,
      meteringEvent: {
        eventIdentifier: null,
        ts: null,
        organizationIdentifier: '160f8db5-40c2-11ea-a4e8-124feabd863a',
        properties: {},
      },
    };
    return await getMeteringEvents(payload);
  };

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    const aa = getMeteringData();
    console.log(aa);
    
  }, [currentUser]);

  return (
    <ViewLayout header={<BasicLayoutHeader title="Metered Billing" />}>
      <MeterBillingViewOuterContainer>
        <MeterBillingViewContainer>
          <MeterBillingSecondHeader>
            <MeteringFilter />
            <MeteringSearch />
          </MeterBillingSecondHeader>
          <MeteringTable />
        </MeterBillingViewContainer>
      </MeterBillingViewOuterContainer>
    </ViewLayout>
  );
};

export default MeterBillingView;
