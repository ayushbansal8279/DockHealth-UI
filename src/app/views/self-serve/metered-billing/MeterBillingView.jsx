import React, { useEffect, useState } from 'react';
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
import { organizationSelector } from '@/app/selectors/organization-selectors';

const MeterBillingView = () => {
  const history = useHistory();
  const [billingData, setBillingData] = useState({});

  const currentUser = useSelector(userProfileSelector);
  const { organizationIdentifier } = useSelector(organizationSelector);

  const getInitialMeteringData = async () => {
    const payload = {
      meteringEventQuery: {
        organizationIdentifier: organizationIdentifier,
      },
    };
    const result = await getMeteringEvents(payload);
    if (result) setBillingData(result);
  };

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    getInitialMeteringData();
  }, [currentUser]);

  return (
    <ViewLayout header={<BasicLayoutHeader title="Metered Billing" />}>
      <MeterBillingViewOuterContainer>
        <MeterBillingViewContainer>
          <MeterBillingSecondHeader>
            <MeteringFilter
              setBillingData={setBillingData}
              getInitialMeteringData={getInitialMeteringData}
            />
            {/* <MeteringSearch /> */}
          </MeterBillingSecondHeader>
          <MeteringTable billingData={billingData} />
        </MeterBillingViewContainer>
      </MeterBillingViewOuterContainer>
    </ViewLayout>
  );
};

export default MeterBillingView;
